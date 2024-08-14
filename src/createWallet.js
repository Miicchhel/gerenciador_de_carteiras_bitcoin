// Importando as bibliotecas necessárias:
// - bip39: para gerar o mnemonic (uma série de palavras que serve como uma "senha")
// - bip32: para criar a estrutura da carteira HD (Hierarchical Deterministic, que permite gerar várias chaves a partir de uma única seed)
// - bitcoinjs-lib: para manipular os endereços e transações Bitcoin
const bip39 = require('bip39');
const bip32 = require('bip32');
const bitcoin = require('bitcoinjs-lib');

// Definindo a rede que vamos usar:
// - testnet: uma rede de teste para Bitcoin, usada por desenvolvedores para testar transações sem usar dinheiro real
// - bitcoin: a rede principal onde transações reais ocorrem (não estamos usando neste exemplo)
const network = bitcoin.networks.testnet;

// Definindo o caminho de derivação para a carteira HD:
// Este caminho segue o padrão BIP84, que é usado para criar endereços SegWit nativos (começam com "tb1" na testnet).
// - "m/84'": Indica que estamos seguindo o padrão BIP84
// - "1'": Especifica que estamos usando a testnet (para a mainnet seria "0'")
// - "0'/0/0": Identifica a conta e as chaves específicas dentro dessa conta
const path = `m/84'/1'/0'/0/0`;

// Gerando o mnemonic, que é uma frase de 12 palavras usada para criar a seed da carteira.
// O mnemonic é como uma senha mestre que pode ser usada para recuperar toda a carteira.
let mnemonic = bip39.generateMnemonic();

// Convertendo o mnemonic para uma seed binária.
// A seed é usada como base para gerar todas as chaves privadas e públicas na carteira.
let seed = bip39.mnemonicToSeedSync(mnemonic);

// Criando a raiz da carteira HD a partir da seed.
// A raiz é o ponto de partida para derivar todas as outras chaves na estrutura hierárquica.
let root = bip32.fromSeed(seed, network);

// Derivando a conta e a chave específica dentro da estrutura da carteira HD.
// A partir da raiz, seguimos o caminho de derivação especificado para chegar à chave pública e privada desejadas.
let account = root.derivePath(path);
let node = account.derive(0).derive(0).derive(0).derive(0);

// Gerando o endereço Bitcoin SegWit nativo (P2WPKH):
// - O endereço SegWit permite transações mais rápidas e com taxas menores.
// - A chave pública é usada para criar o endereço, que as pessoas podem usar para enviar Bitcoin para você.
let btcAddress = bitcoin.payments.p2wpkh({
    pubkey: node.publicKey,
    network: network
}).address;

console.log("\n** Carteira Gerada **\n");
console.log("Endereço:", btcAddress);
console.log("Chave privada:", node.toWIF());
console.log("Seed:", mnemonic);
console.log("\n** Não esqueça de salvar suas informações **\n");
