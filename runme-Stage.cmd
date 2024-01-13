@SETLOCAL
npm run build
@SET PUBLIC_URL= && serve -s build
