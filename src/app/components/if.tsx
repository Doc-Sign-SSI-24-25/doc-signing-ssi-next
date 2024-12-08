/**
 * Componente para encapsular a lógica de renderização condicional
 * @param props  Objeto contendo a condição e os componentes a serem renderizados
 * @returns O componente a ser renderizado de acordo com a condição
 */
export default function If(props: { condition: boolean; then: React.ReactNode ; else?: React.ReactNode }) {
    if (props.condition) {
        return props.then;
    }
    return props.else;
}