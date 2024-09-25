const { spawn } = require('child_process');

const filePath = process.argv[2];
console.log({ filePath });

if (!filePath) {
  console.error('Por favor, proporciona la ruta del archivo de prueba.');
  process.exit(1);
}

const command = 'npx';
const args = ['jest', '--watch', filePath];

console.log(`Ejecutando comando: ${command} ${args.join(' ')}`);

const jestProcess = spawn(command, args, { stdio: 'inherit' });

jestProcess.on('close', (code) => {
  console.log(`Proceso terminado con código ${code}`);
});

jestProcess.on('error', (err) => {
  console.error(`Error al ejecutar el proceso: ${err.message}`);
});