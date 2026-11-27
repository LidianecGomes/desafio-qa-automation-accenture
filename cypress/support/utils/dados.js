import { fakerPT_BR as faker } from '@faker-js/faker';

/**
 * Geração de massa de dados aleatória, centralizada em um único lugar.
 */

// Senha precisa ter 8+ caracteres, maiúscula, minúscula, número e caractere especial.
export const gerarCredenciais = () => ({
  userName: `qa_${faker.string.alphanumeric(10).toLowerCase()}`,
  password: `Qa@${faker.string.alphanumeric(6)}1a`,
});

// E-mail montado manualmente para evitar acentos (o demoqa valida com regex ASCII).
export const gerarEmail = () => `${faker.string.alpha(8).toLowerCase()}${faker.number.int(999)}@teste.com`;

const ESTADOS_CIDADES = {
  NCR: ['Delhi', 'Gurgaon', 'Noida'],
  'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
  Haryana: ['Karnal', 'Panipat'],
  Rajasthan: ['Jaipur', 'Jaiselmer'],
};

const MATERIAS = ['Maths', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Economics'];
const MESES = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

export const gerarAluno = () => {
  const estado = faker.helpers.objectKey(ESTADOS_CIDADES);
  return {
    nome: faker.person.firstName(),
    sobrenome: faker.person.lastName(),
    email: gerarEmail(),
    genero: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    celular: faker.string.numeric({ length: 10, allowLeadingZeros: false }),
    nascimento: {
      dia: faker.number.int({ min: 1, max: 28 }),
      mes: faker.helpers.arrayElement(MESES),
      ano: String(faker.number.int({ min: 1970, max: 2005 })),
    },
    materias: faker.helpers.arrayElements(MATERIAS, 2),
    hobbies: faker.helpers.arrayElements(['Sports', 'Reading', 'Music'], { min: 1, max: 3 }),
    arquivo: 'arquivo-upload.txt',
    endereco: faker.location.streetAddress({ useFullAddress: true }),
    estado,
    cidade: faker.helpers.arrayElement(ESTADOS_CIDADES[estado]),
  };
};

export const gerarRegistroTabela = () => ({
  nome: faker.person.firstName(),
  sobrenome: faker.person.lastName(),
  email: gerarEmail(),
  idade: String(faker.number.int({ min: 18, max: 65 })),
  salario: String(faker.number.int({ min: 1500, max: 20000 })),
  departamento: faker.helpers.arrayElement(['QA', 'Engenharia', 'Produto', 'Financeiro', 'RH']),
});
