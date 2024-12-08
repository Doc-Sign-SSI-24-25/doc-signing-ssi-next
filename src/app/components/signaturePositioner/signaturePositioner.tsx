// import React, { useState } from 'react';
// import Input from '../input/input';
// import Button from '../ui/button/button';
// import Slider from '../slider/slider';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Slider } from '@/components/ui/slider';
// import { Label } from '@/components/ui/label';

// function SignaturePositioner(
//     props: {
//         positions: number[],
//         onPositionChange: (positions: number[]) => void
//     }
// ) {
//     const [position, setPosition] = useState({ x: 50, y: 50 });

//     // PDF page dimensions (A4 proportions)
//     const pageWidth = 595;
//     const pageHeight = 842;

//     const handlePositionChange = (axis: string, value: number[]) => {
//         setPosition(prev => ({
//             ...prev,
//             [axis]: value[0]
//         }));
//     };

//     return (
//         <div className="w-full max-w-2xl mx-auto p-4">
//             <div className='card'>
//                 <div className='card-header'>
//                     <div className='class-title'>Posicionador de Assinatura PDF</div>
//                 </div>
//                 <div className='card-body'>
//                     <div className="space-y-6">
//                         {/* PDF Preview */}
//                         <div className="relative w-full bg-white border border-gray-200 rounded-lg"
//                             style={{ height: '500px' }}>
//                             {/* Simulated PDF page */}
//                             <div className="absolute inset-4 bg-gray-50 border border-dashed border-gray-300">
//                                 {/* Signature placeholder */}
//                                 <div
//                                     className="absolute bg-blue-500/20 border-2 border-blue-500 rounded w-32 h-16"
//                                     style={{
//                                         left: `${position.x}%`,
//                                         top: `${position.y}%`,
//                                         transform: 'translate(-50%, -50%)'
//                                     }}
//                                 >
//                                     <div className="flex items-center justify-center h-full text-blue-600 text-sm">
//                                         Assinatura
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Controls */}
//                         <div className="space-y-4">
//                             <div className="space-y-2">
//                                 <Slider type="range" label="Posição Horizontal" value={[position.x]}
//                                     onChange={(value: number[]) => handlePositionChange('x', value)}
//                                     min={0}
//                                     max={100}
//                                     step={1} />
//                             </div>

//                             <div className="space-y-2">
//                                 <Slider type="range" label="Posição Vertical" value={[position.y]}
//                                     onChange={(value: number[]) => handlePositionChange('y', value)}
//                                     min={0}
//                                     max={100}
//                                     step={1} />

//                             </div>

//                             <div className="pt-4">
//                                 <Button className="w-full">
//                                     Confirmar Posição
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignaturePositioner;
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '@docsign/app/components/ui/card';
import Button from '@docsign/app/components/ui/button';
import Slider from '../ui/slider';

// Types for better TypeScript support
interface SignaturePosition {
    x: number;
    y: number;
}

interface SignaturePositions {
    [pageNumber: number]: SignaturePosition;
}

// function MultiPageSignaturePositioner(){
function SignaturePositioner(){
    // State for managing PDF pages and signature positions
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(0);
    const [signatures, setSignatures] = useState<SignaturePositions>({});

    // References for file input and PDF canvas
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Handle PDF file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log(file);
        if (!file) return;

        // Use PDF.js to load and render PDF
        const pdfjsLib = await import('pdfjs-dist');
        console.log(pdfjsLib);
        // pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs"

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const typedArray = new Uint8Array(e.target!.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedArray).promise;

                setPageCount(pdf.numPages);
                setCurrentPage(1);
                setPdfFile(file);

                // Initialize signature positions for all pages
                const initialSignatures: SignaturePositions = {};
                for (let i = 1; i <= pdf.numPages; i++) {
                    initialSignatures[i] = { x: 50, y: 50 };
                }
                setSignatures(initialSignatures);

                // Render first page
                await renderPage(pdf, 1);
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    };

    // Render a specific page of the PDF
    const renderPage = async (pdf: any, pageNumber: number) => {
        const page = await pdf.getPage(pageNumber);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Get viewport and scale
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render page on canvas
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        await page.render(renderContext);
    };

    // Update signature position for current page
    const updateSignaturePosition = (axis: 'x' | 'y', value: number[]) => {
        setSignatures(prev => ({
            ...prev,
            [currentPage]: {
                ...prev[currentPage],
                [axis]: value[0]
            }
        }));
    };

    // Navigate between pages
    const changePage = (direction: number) => {
        const newPage = currentPage + direction;
        if (newPage > 0 && newPage <= pageCount) {
            setCurrentPage(newPage);
        }
    };

    // Render signature placeholder on current page
    const renderSignaturePlaceholder = () => {
        const position = signatures[currentPage];
        return (
            <div
                className="absolute border-2 border-blue-500 rounded bg-blue-100/20"
                style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '150px',
                    height: '50px'
                }}
            >
                <div className="flex items-center justify-center h-full text-blue-600 text-sm">
                    Assinatura Digital
                </div>
            </div>
        );
    };

    // Confirm signature positions
    const confirmSignaturePositions = () => {
        console.log('Signature positions:', signatures);
        // Here you would typically send the signature positions to a backend service
        // or prepare the PDF with signatures in the specified locations
        alert('Posições das assinaturas confirmadas!');
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Posicionador de Assinatura Digital PDF - Múltiplas Páginas</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="space-y-6">
                        {/* PDF File Upload */}
                        {!pdfFile && (
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="d-none"
                                />
                                <Button
                                    outline={true}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Carregar PDF
                                    {/* <Upload className="mr-2" /> Carregar PDF */}
                                </Button>
                            </div>
                        )}

                        {/* PDF Viewer and Signature Placement */}
                        {pdfFile && (
                            <div className="space-y-4">
                                {/* Page Navigation */}
                                <div className="flex items-center justify-between">
                                    <Button
                                        outline={true}
                                        // size="icon"
                                        onClick={() => changePage(-1)}
                                        disabled={currentPage <= 1}
                                    >
                                        &lt;
                                    </Button>
                                    <span>Página {currentPage} de {pageCount}</span>
                                    <Button
                                        outline={true}
                                        // size="icon"
                                        onClick={() => changePage(1)}
                                        disabled={currentPage >= pageCount}
                                    >
                                        &gt;
                                    </Button>
                                </div>

                                {/* PDF Canvas and Signature Placement */}
                                <div className="relative w-full overflow-auto">
                                    <canvas
                                        ref={canvasRef}
                                        className="mx-auto border shadow-md"
                                    />
                                    {renderSignaturePlaceholder()}
                                </div>

                                {/* Positioning Controls */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Slider
                                            label="Posição Horizontal"
                                            value={[signatures[currentPage].x]}
                                            onValueChange={(value: any) => updateSignaturePosition('x', value)}
                                            min={0}
                                            max={100}
                                            step={1}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Slider
                                            label="Posição Vertical"
                                            value={[signatures[currentPage].y]}
                                            onValueChange={(value: any) => updateSignaturePosition('y', value)}
                                            min={0}
                                            max={100}
                                            step={1}
                                        />
                                    </div>

                                    {/* Confirm Button */}
                                    <Button
                                        className="w-full mt-4"
                                        onClick={confirmSignaturePositions}
                                    >
                                        Confirmar Posições das Assinaturas
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div >
    );
};

export default SignaturePositioner;