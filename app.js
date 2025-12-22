// BANCO DE DADOS EXPANDIDO
const produtosMock = [
    { id: "1", nome: "Kimono Ultra Light A1", preco: 489.90, desc: "Trançado leve para competição.", img: "https://m.media-amazon.com/images/I/61QuXkynwyL._AC_UF1000,1000_QL80_.jpg", category: "Kimono", sizes: ["A1", "A2", "A3", "A4"], colors: ["Branco", "Preto", "Azul"] },

    { id: "2", nome: "Faixa Preta Competition", preco: 95.00, desc: "12 costuras oficiais.", img: "./assets/bjjblack.jpg", category: "Faixa", sizes: ["A1", "A2", "A3", "A4"], colors: ["Branco", "Preto", "Azul"] },
    { id: "3", nome: "Rashguard Armor Black", preco: 149.90, desc: "Proteção UV e compressão.", img: "./assets/rash.jpg", category: "Rashguard", sizes: ["P", "M", "G", "GG"], colors: ["Preto", "Cinza"] },
    { id: "4", nome: "Bolsa de Treino 40L", preco: 210.00, desc: "Espaço para 2 kimonos.", img: "./assets/mochila.jpg", category: "Acessorio", sizes: ["Único"], colors: ["Preto"] },
    { id: "5", nome: "Kimono Blue Warrior", preco: 520.00, desc: "Edição limitada azul royal.", img: "./assets/kimono.jpg", category: "Kimono", sizes: ["A1", "A2", "A3", "A4"], colors: ["Branco", "Preto", "Azul"] },
    { id: "6", nome: "Shorts No-Gi Stealth", preco: 129.00, desc: "Abertura lateral para mobilidade.", img: "./assets/bermuda.jpg", category: "Acessorio", sizes: ["P", "M", "G", "GG"], colors: ["Preto", "Azul"] },
    { id: "7", nome: "Kneepad Gel Pro", preco: 85.00, desc: "Proteção extra para os joelhos.", img: "./assets/joelheira.jpg", category: "Acessorio", sizes: ["P", "M", "G"], colors: ["Preto"] },
    { id: "8", nome: "Chinelo BJJ Style", preco: 55.00, desc: "Conforto pós-treino.", img: "./assets/chinelo.jpg", category: "Acessorio", sizes: ["36-37", "38-39", "40-41", "42-43"], colors: ["Preto", "Branco"] },

    { id: "9", nome: "Kimono Samurai Edition Branco", preco: 699.90, desc: "Edição limitada com bordados samurai e tecido premium ultra-resistente.", img: "https://cdn.shopify.com/s/files/1/1229/2604/files/ISAMI_White_with_patches-horz_large.jpg?9263716183051758241", category: "Kimono", sizes: ["A1", "A2", "A3", "A4"], colors: ["Branco"] },
    { id: "10", nome: "Spats Compression Tao Black", preco: 139.90, desc: "Calça de compressão No-Gi com design tao para maior mobilidade.", img: "http://www.shogunfight.com/cdn/shop/products/Screen_Shot_2017-03-01_at_2.25.19_PM_1024x1024.jpg?v=1546010310", category: "Acessorio", sizes: ["P", "M", "G", "GG"], colors: ["Preto"] },
    { id: "11", nome: "Protetor de Orelha Elite Guard", preco: 149.90, desc: "Headgear ajustável para prevenir orelha de couve-flor.", img: "https://m.media-amazon.com/images/I/01UwfHrld%2BL._TSa%7Csize%3A1910%2C1000%7Cformat%3A%28A%2Cf%2Cb%2Cd%2Cpi%2Cpl%2Co%29%7Cb-src%3A61Cd2rJZgRL.png%7Cb-pos%3A0%2C0%2C1910%2C1000%7Cpi-src%3A7170MstW4CL.jpg%7Cpi-pos%3A1000%2C100%2C840%2C840.json", category: "Acessorio", sizes: ["Único"], colors: ["Preto"] },
    { id: "12", nome: "Protetor Bucal Custom Fit", preco: 89.90, desc: "Protetor bucal moldável de alto impacto para treinos pesados.", img: "https://m.media-amazon.com/images/I/71bbGYqXfDL._AC_UF1000,1000_QL80_.jpg", category: "Acessorio", sizes: ["Único"], colors: ["Preto", "Transparente"] },
    { id: "13", nome: "Mochila Gear Expandable 60L", preco: 319.90, desc: "Mochila/duffel expansível com múltiplos compartimentos para equipamentos.", img: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/36525f96-d1c9-4240-bd2e-3932595fa5b1.__CR0,0,600,450_PT0_SX600_V1___.jpg", category: "Acessorio", sizes: ["Único"], colors: ["Preto"] },
    { id: "14", nome: "Tornozeleira Compression Pro", preco: 99.90, desc: "Suporte para tornozelo com compressão para prevenção de lesões.", img: "https://www.donjoystore.com/media/catalog/product/cache/25db35f0819453b15c051664bd2c0f47/d/o/donjoy-performance-pod-black-ankle-brace.jpg", category: "Acessorio", sizes: ["P", "M", "G"], colors: ["Preto"] },
    { id: "15", nome: "Fita para Dedos Athletic Pack", preco: 49.90, desc: "Pacote com 8 rolos de fita atlética para proteção dos dedos.", img: "https://m.media-amazon.com/images/I/71RSHUB6x5L._AC_UF1000,1000_QL80_.jpg", category: "Acessorio", sizes: ["Único"], colors: ["Preto"] },
    { id: "16", nome: "Rashguard Feminino Kraken Long Sleeve", preco: 179.90, desc: "Rashguard manga longa feminino com design kraken exclusivo.", img: "https://www.ravenfightwear.com/cdn/shop/files/kraken-jiu-jitsu-club-rashguard-womens-875673.jpg?v=1723038710&width=1445", category: "Rashguard", sizes: ["P", "M", "G", "GG"], colors: ["Preto"] },
    { id: "17", nome: "Moletom BJJ Rapid Hoodie", preco: 199.90, desc: "Moletom confortável com capuz para pós-treino ou casual.", img: "https://www.rolljunkie.com/cdn/shop/files/rapid_bjj_hoodie_front2.jpg?v=1710967724&width=1200", category: "Acessorio", sizes: ["P", "M", "G", "GG"], colors: ["Preto"] },
    { id: "18", nome: "Patch Lifestyle Gorilla", preco: 29.90, desc: "Patch bordado gorilla para customizar seu kimono.", img: "https://i.etsystatic.com/14615478/c/1052/836/0/184/il/3130fc/4184364178/il_340x270.4184364178_q59t.jpg", category: "Acessorio", sizes: ["Único"], colors: ["Preto"] }
];
let carrinho = [];
let favoritos = [];
let filtroCategoria = '';

// INICIALIZAR
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    document.getElementById('inputBusca').addEventListener('input', renderizarProdutos);
    document.getElementById('btnCarrinho').onclick = () => toggleMenu('menuCarrinho');
    document.getElementById('btnFavoritos').onclick = () => toggleMenu('menuFavoritos');
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtroCategoria = btn.dataset.categoria;
            renderizarProdutos();
        };
    });

    // Fechar modal ao clicar fora
    document.getElementById('modalProduto').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalProduto')) {
            fecharModal();
        }
    });
    document.getElementById('modalEdit').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalEdit')) {
            fecharModal('modalEdit');
        }
    });
});

function renderizarProdutos() {
    const grid = document.getElementById('gridProdutos');
    const busca = document.getElementById('inputBusca').value.toLowerCase();

    const filtrados = produtosMock.filter(p => 
        p.nome.toLowerCase().includes(busca) && 
        (filtroCategoria === '' || p.category === filtroCategoria)
    );

    grid.innerHTML = filtrados.map(p => {
        const precoFormatado = p.preco.toFixed(2).replace('.', ',');
        return `
        <div class="produto-card" onclick="abrirModal('${p.id}')">
            <img src="${p.img}" class="card-imagem" alt="${p.nome}">

            <div class="card-header">
                <button onclick="event.stopPropagation(); toggleFav('${p.id}')">
                    <i class="fa${favoritos.includes(p.id) ? 's' : 'r'} fa-heart" style="color: ${favoritos.includes(p.id) ? '#ff3b30' : '#ccc'}"></i>
                </button>
            </div>

            <div class="card-conteudo">
                <p class="card-nome">${p.nome}</p>

                <p class="card-descricao" id="desc-${p.id}">${p.desc}</p>

                <span class="ver-mais" id="toggle-${p.id}" onclick="event.stopPropagation(); toggleDesc('${p.id}')"></span>

                <p class="card-preco">R$ ${precoFormatado}</p>

                <button class="btn-adicionar" onclick="event.stopPropagation(); abrirModal('${p.id}')">
                    ADICIONAR
                </button>
            </div>
        </div>
    `;
    }).join('');

    // Configurar "Ver mais"
    document.querySelectorAll('.card-descricao').forEach(desc => {
        const toggle = desc.nextElementSibling;
        if (desc.scrollHeight > 45) {
            toggle.textContent = "Ver mais";
            toggle.style.display = "block";
        } else {
            toggle.style.display = "none";
        }
    });
}

window.toggleDesc = (id) => {
    const desc = document.getElementById(`desc-${id}`);
    const toggle = document.getElementById(`toggle-${id}`);

    desc.classList.toggle('expandida');

    toggle.textContent = desc.classList.contains('expandida') ? "Ver menos" : "Ver mais";
};

window.abrirModal = (id) => {
    const p = produtosMock.find(x => x.id === id);
    const modal = document.getElementById('modalProduto');
    modal.innerHTML = `
        <div class="modal-conteudo">
            <button class="close-btn" onclick="fecharModal()">&times;</button>
            <img src="${p.img}" class="modal-imagem" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p style="color: #666;">${p.desc}</p>
            <h2 style="color: #2ecc71;">R$ ${p.preco.toFixed(2)}</h2>
            <div class="modal-options">
                <label>Tamanho: 
                    <select id="size">
                        <option value="">Selecione tamanho</option>
                        ${p.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </label>
                <label>Cor: 
                    <select id="color">
                        <option value="">Selecione cor</option>
                        ${p.colors.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                </label>
                <label>Quantidade: 
                    <input type="number" id="quantity" value="1" min="1">
                </label>
            </div>
            <div class="modal-botoes">
                <button class="btn-adicionar" style="flex: 1;" onclick="addToCartWithOptions('${p.id}')">
                    ADICIONAR AO CARRINHO
                </button>
                <button class="btn-compartilhar" onclick="compartilhar('${p.nome}', '${p.id}')">
                    <i class="fa-solid fa-arrow-up-from-bracket"></i>
                </button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
};

window.fecharModal = (modalId = 'modalProduto') => {
    document.getElementById(modalId).style.display = 'none';
};

window.compartilhar = async (nome, id) => {
    const shareData = {
        title: 'BJJ Store',
        text: `Olha esse ${nome} que encontrei na BJJ Store!`,
        url: window.location.href
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            alert("Link copiado para a área de transferência!");
            await navigator.clipboard.writeText(window.location.href);
        }
    } catch (err) {
        console.log(err);
    }
};

window.addToCartWithOptions = (id) => {
    const size = document.getElementById('size').value;
    const color = document.getElementById('color').value;
    const qtd = parseInt(document.getElementById('quantity').value) || 1;

    if (!size || !color) {
        alert('Por favor, selecione tamanho e cor.');
        return;
    }

    const p = produtosMock.find(x => x.id === id);
    const existe = carrinho.find(item => item.id === id && item.size === size && item.color === color);

    if (existe) {
        existe.qtd += qtd;
    } else {
        carrinho.push({ 
            ...p, 
            size, 
            color, 
            qtd, 
            selected: true, 
            uniqueId: 'cart_' + Date.now() + '_' + Math.floor(Math.random() * 1000000)
        });
    }

    atualizarTudo();
    renderizarCarrinho();
    toggleMenu('menuCarrinho');
    fecharModal();
};

// === FUNÇÕES CRÍTICAS DO CARRINHO – GARANTIDAS NO WINDOW ===

window.abrirEdit = (uniqueId) => {
    const item = carrinho.find(i => i.uniqueId === uniqueId);
    if (!item) return;

    const p = produtosMock.find(x => x.id === item.id);
    if (!p) return;

    const modal = document.getElementById('modalEdit');

    modal.innerHTML = `
        <div class="modal-conteudo">
            <button class="close-btn" onclick="fecharModal('modalEdit')">&times;</button>
            <h3>Editar ${item.nome}</h3>
            <div class="modal-options">
                <label>Tamanho: 
                    <select id="edit-size">
                        <option value="">Selecione tamanho</option>
                        ${p.sizes.map(s => `<option value="${s}" ${s === item.size ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                </label>
                <label>Cor: 
                    <select id="edit-color">
                        <option value="">Selecione cor</option>
                        ${p.colors.map(c => `<option value="${c}" ${c === item.color ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                </label>
            </div>
            <button class="btn-adicionar" onclick="salvarEdit('${uniqueId}')">Salvar alterações</button>
        </div>
    `;
    modal.style.display = 'flex';
};

window.salvarEdit = (uniqueId) => {
    const newSize = document.getElementById('edit-size').value;
    const newColor = document.getElementById('edit-color').value;

    if (!newSize || !newColor) {
        alert('Por favor, selecione tamanho e cor.');
        return;
    }

    const item = carrinho.find(i => i.uniqueId === uniqueId);
    if (item) {
        item.size = newSize;
        item.color = newColor;
    }

    fecharModal('modalEdit');
    renderizarCarrinho();
};

window.changeQtd = (uniqueId, delta) => {
    const item = carrinho.find(i => i.uniqueId === uniqueId);
    if (!item) return;

    item.qtd += delta;

    if (item.qtd <= 0) {
        carrinho = carrinho.filter(i => i.uniqueId !== uniqueId);
    }

    renderizarCarrinho();
    atualizarTudo();
};

window.toggleSelect = (uniqueId) => {
    const item = carrinho.find(i => i.uniqueId === uniqueId);

    if (item) item.selected = !item.selected;

    renderizarCarrinho();
    atualizarTudo();
};

window.selectAll = () => {
    const checked = document.getElementById('selectAll')?.checked || false;

    carrinho.forEach(item => item.selected = checked);

    renderizarCarrinho();
    atualizarTudo();
};

function gerarMensagemPedido() {
    const selectedItems = carrinho.filter(item => item.selected);

    if (selectedItems.length === 0) {
        alert('Nenhum item selecionado para compra.');
        return null;
    }

    let mensagem = "🔥 *PEDIDO - BJJ STORE* 🔥\n\n";
    mensagem += "🛍️ *Itens selecionados:*\n\n";

    selectedItems.forEach(item => {
        const subtotal = (item.preco * item.qtd).toFixed(2).replace('.', ',');
        mensagem += `• ${item.nome}\n`;
        mensagem += `   - Tamanho: ${item.size}\n`;
        mensagem += `   - Cor: ${item.color}\n`;
        mensagem += `   - Quantidade: ${item.qtd}\n`;
        mensagem += `   - Subtotal: R$ ${subtotal}\n\n`;
    });

    const total = selectedItems.reduce((sum, item) => sum + (item.preco * item.qtd), 0);
    const totalFormatado = total.toFixed(2).replace('.', ',');

    mensagem += `💰 *Total do pedido:* R$ ${totalFormatado}\n\n`;
    mensagem += "Aguardando retorno 😄";

    return mensagem;
}

window.finalizarNoWhatsApp = () => {
    const mensagem = gerarMensagemPedido();
    if (!mensagem) return;

    const fone = "5561982610405";

    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(mensagem)}`, "_blank");
};

window.finalizarNoInstagram = () => {
    const mensagem = gerarMensagemPedido();
    if (!mensagem) return;

    const instaUsername = "_pedrinsouzaa";//"bjjstore_oficial"; // ALTERE AQUI

    const textoEncoded = encodeURIComponent(mensagem);
    window.open(`https://ig.me/m/${instaUsername}?text=${textoEncoded}`, "_blank");
};

function atualizarTudo() {
    document.getElementById('badgeCart').innerText = carrinho.length;
    document.getElementById('badgeFav').innerText = favoritos.length;
}

function renderizarCarrinho() {

    const total = carrinho
        .filter(i => i.selected)
        .reduce((sum, item) => sum + (item.preco * item.qtd), 0);

    const totalFormatado = total.toFixed(2).replace('.', ',');

    const menu = document.getElementById('menuCarrinho');

    let itensHTML = '';

    if (carrinho.length === 0) {
        itensHTML = '<p style="text-align:center; color:#999; padding:40px 20px;">Carrinho vazio</p>';

    } else {

        itensHTML = carrinho.map(item => {
            const subtotal = (item.preco * item.qtd).toFixed(2).replace('.', ',');
            return `
            <div class="item-carrinho" style="padding: 8px 0; gap: 8px;">
                <input type="checkbox" class="circle-checkbox"
                       onclick="toggleSelect('${item.uniqueId}')"
                       ${item.selected ? 'checked' : ''}>

                <img src="${item.img}" style="width: 45px; height: 45px;" alt="${item.nome}">

                <div style="flex:1; min-width:0;">
                    <p style="margin:0; font-weight:600; font-size:13px;">${item.nome}</p>
                    <p style="margin:3px 0 0; font-size:12px; color:#666;">
                        ${item.size} • ${item.color}
                    </p>
                    <p style="margin:6px 0 0; color:#2ecc71; font-weight:700; font-size:14px;">
                        R$ ${subtotal}
                    </p>
                </div>

                <div class="qtd-controls" style="gap:4px;">
                    <button onclick="changeQtd('${item.uniqueId}', -1)">-</button>
                    <span>${item.qtd}</span>
                    <button onclick="changeQtd('${item.uniqueId}', 1)">+</button>
                </div>

                <button class="btn-edit" style="color: #007bff; padding:4px 8px; font-size:12px;" onclick="abrirEdit('${item.uniqueId}')">Editar</button>
            </div>
        `;
        }).join('');
    }

    menu.innerHTML = `
    <div class="menu-header">
        <div class="header-left">
            <h2>Meu Carrinho (${carrinho.length})</h2>

            ${carrinho.length > 0 ?
                `<label style="font-size:14px; cursor:pointer; margin-top:-2px;">
                    <input type="checkbox" class="circle-checkbox" id="selectAll" onclick="selectAll()">
                    Selecionar todos
                </label>`
            : ''}
        </div>

        <button class="close-btn" onclick="toggleMenu('menuCarrinho')">&times;</button>
    </div>

    <div class="menu-itens-container">
        ${itensHTML}
    </div>

    ${carrinho.length > 0 ? `
        <div style="padding: 8px 0 12px; background: #fff; border-top: 1px solid #eee;">
            <h3 style="text-align:center; margin:0 0 10px; font-size:17px; font-weight:700;">
                Total: R$ ${totalFormatado}
            </h3>

            <button class="btn-checkout" style="background:#25D366; margin:0 0 3px; padding:10px; border-radius:10px;" onclick="finalizarNoWhatsApp()">
                Finalizar no WhatsApp
            </button>

            <button class="btn-checkout" style="background:#E1306C; padding:10px; border-radius:10px;" onclick="finalizarNoInstagram()">
                Finalizar no Instagram
            </button>
        </div>
    ` : ''}
    `;

    if (carrinho.length > 0) {
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.checked = carrinho.every(i => i.selected);
        }
    }
}

function renderizarFavoritos() {
    const menu = document.getElementById('menuFavoritos');
    
    const itensFavoritosHTML = favoritos.length === 0 
        ? '<p style="text-align:center; color:#999; padding:40px 20px;">Nenhum favorito</p>'
        : favoritos.map(id => {
            const p = produtosMock.find(x => x.id === id);
            if (!p) return '';
            const precoFormatado = p.preco.toFixed(2).replace('.', ',');
            return `
                <div class="item-fav">
                    <img src="${p.img}" alt="${p.nome}">
                    <div style="flex: 1;">
                        <p style="margin:0; font-weight: 600;">${p.nome}</p>
                        <p style="margin:0; color: #2ecc71; font-weight:700;">R$ ${precoFormatado}</p>
                    </div>
                    <!-- BOTÕES MAIS PEQUENOS NO FAVORITOS -->
                    <button style="color: red; padding: 6px 10px; font-size: 12px;" onclick="removerDosFavoritos('${id}')">Remover</button>
                    <button style="padding: 6px 10px; font-size: 12px;" onclick="abrirModal('${id}'); toggleMenu('menuFavoritos')">Comprar</button>
                </div>
            `;
          }).join('');

    menu.innerHTML = `
        <div class="menu-header">
            <h2>Meus Favoritos (${favoritos.length})</h2>
            <button class="close-btn" onclick="toggleMenu('menuFavoritos')">&times;</button>
        </div>
        
        <div class="menu-itens-container">
            ${itensFavoritosHTML}
        </div>
    `;
}

window.removerDosFavoritos = (id) => {
    favoritos = favoritos.filter(x => x !== id);
    atualizarTudo();
    renderizarProdutos();
    renderizarFavoritos();
};

window.toggleMenu = (id) => {
    const menuElement = document.getElementById(id);
    menuElement.classList.toggle('aberto');
    
    if (menuElement.classList.contains('aberto')) {
        if (id === 'menuCarrinho') {
            renderizarCarrinho();
        } else if (id === 'menuFavoritos') {
            renderizarFavoritos();
        }
    }
};

window.toggleFav = (id) => {
    if (favoritos.includes(id)) {
        removerDosFavoritos(id);
    } else {
        favoritos.push(id);
        atualizarTudo();
        renderizarProdutos();
        if (document.getElementById('menuFavoritos').classList.contains('aberto')) {
            renderizarFavoritos();
        }
    }
};