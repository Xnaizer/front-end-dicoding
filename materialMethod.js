// element.setAttribute('nama_atribut', 'nilai_atribut');

const gambar = document.getElementById('gambar');

console.log(gambar);


gambar.setAttribute('width', 300);
gambar.setAttribute('height', 215);


const buttons = document.querySelectorAll('.button');
const playButton = buttons[3].children[0]; 
playButton.setAttribute('type', 'submit');
