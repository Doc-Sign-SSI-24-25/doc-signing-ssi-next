import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_ROUTES = ['/login', '/register', '/validate'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;
  // console.log('token: '+token);

  // Permitir acesso às rotas públicas
  if (PUBLIC_ROUTES.includes(pathname)) {
    // Redirecionar o usuário para a página inicial se ele já estiver logado
    // quando tentar acessar uma rota pública, exceto a página de validação
    if (token && !pathname.includes('/validate')) {
      return NextResponse.redirect(new URL('/-/home', request.url));
    }
    return NextResponse.next();
  }
  if (!token) {
    console.log('redirecionando para login');
    // Redirecionar para a página de login se o token não existir
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Alterar para utilizar um token JWT válido
  if (token.length != 24) {
    //formato de token inválido
    return NextResponse.redirect(new URL('/login', request.url));
  } else {
    if (pathname.includes('/-/')) {
      return NextResponse.next();
    }
    else
      return NextResponse.redirect(new URL('/-/' + pathname, request.url));
  }

  // try {
  //   // Verificar o JWT
  //   // jwt.verify(token, process.env.JWT_SECRET!);
  //   return NextResponse.next();
  // } catch (err) {
  //   // Token inválido ou expirado, redireciona para login
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
}

export const config = {
  matcher: [
    // Aplica o middleware a todas as rotas, exceto arquivos estáticos
    '/((?!_next/static|favicon.ico).*)',
  ],
};