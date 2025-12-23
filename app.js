// BANCO DE DADOS EXPANDIDO
import { produtosMock as produtosOriginais } from './produtos.js';

let produtosMock = (JSON.parse(localStorage.getItem('produtosLoja')) || [...produtosOriginais]).map(p => ({
    ...p,
    stockQuantity: p.stockQuantity ?? 10,
    isLimitedEdition: p.isLimitedEdition ?? false,
    isOutOfStock: p.isOutOfStock ?? false
}));
let carrinho = [];
let favoritos = [];
let filtroCategoria = '';
let isAdmin = false;

function salvarProdutos() {
    localStorage.setItem('produtosLoja', JSON.stringify(produtosMock));
}

function toggleBodyScroll(enable) {
    document.body.style.overflow = enable ? '' : 'hidden';
}

// INICIALIZAR
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    document.getElementById('inputBusca').addEventListener('input', renderizarProdutos);
    document.getElementById('btnCarrinho').onclick = () => toggleMenu('menuCarrinho');
    document.getElementById('btnFavoritos').onclick = () => toggleMenu('menuFavoritos');
    document.getElementById('btnAdmin').onclick = () => {
        if (isAdmin) {
            isAdmin = false;
            alert('🔒 Modo ADMIN desativado');
            renderizarProdutos();
        } else {
            abrirAdminLogin();
        }
    };
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
    grid.innerHTML = `
        ${isAdmin ? `
            <button class="btn-adicionar" style="margin:20px auto; display:block;" onclick="abrirAdminNovoProduto()">
                ➕ Novo Produto
            </button>
        ` : ''}
    ` + filtrados.map(p => {
        const precoFormatado = p.preco.toFixed(2).replace('.', ',');
        return `
        <div class="produto-card" onclick="abrirModal('${p.id}')">
            <img src="${p.img}" class="card-imagem" alt="${p.nome}">
            <div class="card-header">
                ${isAdmin ? `
                    <button onclick="event.stopPropagation(); abrirAdminEditar('${p.id}')">
                        <i class="fas fa-edit" style="color: #007bff;"></i>
                    </button>
                ` : `
                    <button onclick="event.stopPropagation(); toggleFav('${p.id}')">
                        <i class="fa${favoritos.includes(p.id) ? 's' : 'r'} fa-heart" style="color: ${favoritos.includes(p.id) ? '#ff3b30' : '#ccc'}"></i>
                    </button>
                `}
            </div>
            <div class="card-conteudo">
                <p class="card-nome">${p.nome}</p>
                <p class="card-descricao" id="desc-${p.id}">${p.desc}</p>
                <span class="ver-mais" id="toggle-${p.id}" onclick="event.stopPropagation(); toggleDesc('${p.id}')"></span>
                <p class="card-preco">R$ ${precoFormatado}</p>
                ${p.isLimitedEdition ? '<span style="background:#ffd700; color:#000; padding:2px 6px; border-radius:4px; font-size:12px; margin-right:5px;">Limitado</span>' : ''}
                ${p.isOutOfStock ? '<span style="background:#ff0000; color:#fff; padding:2px 6px; border-radius:4px; font-size:12px;">Esgotado</span>' : ''}
                <button class="btn-adicionar" onclick="event.stopPropagation(); abrirModal('${p.id}')" ${p.isOutOfStock ? 'disabled style="background:#ccc;"' : ''}>
                    ${p.isOutOfStock ? 'ESGOTADO' : 'ADICIONAR'}
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
            ${p.isLimitedEdition ? '<span style="background:#ffd700; color:#000; padding:4px 8px; border-radius:6px; display:block; margin:10px 0; text-align:center;">Edição Limitada</span>' : ''}
            ${p.isOutOfStock ? '<span style="background:#ff0000; color:#fff; padding:4px 8px; border-radius:6px; display:block; margin:10px 0; text-align:center;">Esgotado</span>' : ''}
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
                    <input type="number" id="quantity" value="1" min="1" max="${p.stockQuantity}">
                </label>
            </div>
            <div class="modal-botoes">
                ${p.isOutOfStock ? '<p style="color:#ff0000; flex:1; text-align:center;">Produto Esgotado</p>' : `
                <button class="btn-adicionar" style="flex: 1;" onclick="addToCartWithOptions('${p.id}')">
                    ADICIONAR AO CARRINHO
                </button>
                `}
                <button class="btn-compartilhar" onclick="compartilhar('${p.nome}', '${p.id}')">
                    <i class="fa-solid fa-arrow-up-from-bracket"></i>
                </button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    toggleBodyScroll(false);
};
window.fecharModal = (modalId = 'modalProduto') => {
    document.getElementById(modalId).style.display = 'none';
    toggleBodyScroll(true);
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
    if (p.isOutOfStock) {
        alert('Produto esgotado.');
        return;
    }
    const existe = carrinho.find(item => item.id === id && item.size === size && item.color === color);
    const currentQtd = existe ? existe.qtd : 0;
    if (p.stockQuantity < currentQtd + qtd) {
        alert('Estoque insuficiente.');
        return;
    }
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
    toggleBodyScroll(false);
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
    const p = produtosMock.find(x => x.id === item.id);
    if (item.qtd + delta > p.stockQuantity) {
        alert('Estoque insuficiente.');
        return;
    }
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
        mensagem += ` - Tamanho: ${item.size}\n`;
        mensagem += ` - Cor: ${item.color}\n`;
        mensagem += ` - Quantidade: ${item.qtd}\n`;
        mensagem += ` - Subtotal: R$ ${subtotal}\n\n`;
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
    <div class="menu-itens-container" style="overflow:auto;">
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
       
        <div class="menu-itens-container" style="overflow:auto;">
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
let outsideClickListeners = {};
window.toggleMenu = (id) => {
    const menuElement = document.getElementById(id);
    const isOpening = !menuElement.classList.contains('aberto');
    menuElement.classList.toggle('aberto');
   
    if (isOpening) {
        toggleBodyScroll(false);
        if (id === 'menuCarrinho') {
            renderizarCarrinho();
        } else if (id === 'menuFavoritos') {
            renderizarFavoritos();
        }
        outsideClickListeners[id] = (e) => {
            if (!menuElement.contains(e.target)) {
                toggleMenu(id);
            }
        };
        setTimeout(() => document.addEventListener('click', outsideClickListeners[id]), 0);
    } else {
        toggleBodyScroll(true);
        if (outsideClickListeners[id]) {
            document.removeEventListener('click', outsideClickListeners[id]);
            delete outsideClickListeners[id];
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
window.abrirAdminLogin = () => {
    const modal = document.getElementById('modalEdit');
    modal.innerHTML = `
        <div class="modal-conteudo" style="max-width:400px; padding:20px;">
            <button class="close-btn" onclick="fecharModal('modalEdit')">&times;</button>
            <h3 style="text-align:center; margin-bottom:20px;">Login Admin</h3>
            <label style="display:block; margin-bottom:5px; font-weight:bold;">Email:</label>
            <input id="admin-email" type="email" placeholder="Email" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ccc; border-radius:4px;">
            <label style="display:block; margin-bottom:5px; font-weight:bold;">Senha:</label>
            <input id="admin-senha" type="password" placeholder="Senha" style="width:100%; padding:10px; margin-bottom:20px; border:1px solid #ccc; border-radius:4px;">
            <button class="btn-adicionar" style="width:100%; padding:12px;" onclick="verificarAdminLogin()">Entrar</button>
        </div>
    `;
    modal.style.display = 'flex';
    toggleBodyScroll(false);
};
window.verificarAdminLogin = () => {
    const email = document.getElementById('admin-email').value;
    const senha = document.getElementById('admin-senha').value;
    if (email === 'pedro7.dev@gmail.com' && senha === 'pedrodev777') {
        isAdmin = true;
        alert('🔓 Modo ADMIN ativado');
        fecharModal('modalEdit');
        renderizarProdutos();
    } else {
        alert('Credenciais inválidas');
    }
};
window.abrirAdminEditar = (id) => {
    const p = produtosMock.find(x => x.id === id);
    if (!p) return;
    abrirAdminFormulario(p);
};
window.abrirAdminNovoProduto = () => {
    abrirAdminFormulario({
        id: Date.now().toString(),
        nome: '',
        preco: 0,
        desc: '',
        img: '',
        category: '',
        sizes: [],
        colors: [],
        stockQuantity: 0,
        isLimitedEdition: false,
        isOutOfStock: false
    }, true);
};
function abrirAdminFormulario(p, novo = false) {
    const modal = document.getElementById('modalEdit');
    modal.innerHTML = `
        <div class="modal-conteudo admin-form-modal" style="max-width:560px; width:95%; max-height:90vh; padding:24px; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
            <button class="close-btn" onclick="fecharModal('modalEdit')">&times;</button>
            <h3 style="text-align:center; margin-bottom:24px; font-size:20px; color:#333;">${novo ? 'Novo Produto' : 'Editar Produto'}</h3>
            <div class="admin-form-container" style="overflow-y:auto; max-height:calc(90vh - 140px); padding-right:8px;">
                <form id="adminForm" style="display:grid; gap:18px;">
                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#444;">Nome do produto</label>
                        <input id="adm-nome" placeholder="Ex: Kimono Ultra Light" value="${p.nome}" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size:15px;">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#444;">Preço (R$)</label>
                        <input id="adm-preco" type="number" step="0.01" placeholder="0.00" value="${p.preco}" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size:15px;">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#444;">Descrição</label>
                        <textarea id="adm-desc" placeholder="Descrição detalhada do produto" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; min-height:120px; font-size:15px; resize:vertical;">${p.desc}</textarea>
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#444;">Categoria</label>
                        <input id="adm-cat" placeholder="Ex: Kimono, Rashguard, Acessorio" value="${p.category}" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size:15px;">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#444;">Tamanhos (separados por vírgula)</label>
                        <input id="adm-sizes" placeholder="A1, A2, A3, A4" value="${p.sizes.join(', ')}" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size:15px;">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#444;">Cores (separadas por vírgula)</label>
                        <input id="adm-colors" placeholder="Branco, Preto, Azul" value="${p.colors.join(', ')}" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size:15px;">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#444;">Quantidade em estoque</label>
                        <input id="adm-stock" type="number" min="0" placeholder="0" value="${p.stockQuantity}" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size:15px;">
                    </div>
                    <div style="display:flex; align-items:center; gap:12px; padding:8px 0;">
                        <input id="adm-limited" type="checkbox" ${p.isLimitedEdition ? 'checked' : ''} style="width:18px; height:18px;">
                        <label style="font-weight:600; color:#444; cursor:pointer;">Edição Limitada</label>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px; padding:8px 0;">
                        <input id="adm-outofstock" type="checkbox" ${p.isOutOfStock ? 'checked' : ''} style="width:18px; height:18px;">
                        <label style="font-weight:600; color:#444; cursor:pointer;">Marcar como Esgotado</label>
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#444;">Imagem do produto</label>
                        <input id="adm-img-url" placeholder="Cole a URL da imagem aqui" value="${p.img.startsWith('data:') ? '' : p.img}" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; font-size:15px; margin-bottom:12px;">
                        <div style="text-align:center; font-style:italic; color:#666; margin-bottom:8px;">OU faça upload de uma imagem</div>
                        <input type="file" id="adm-img-file" accept="image/*" style="width:100%; padding:8px; border:1px dashed #aaa; border-radius:8px; background:#f9f9f9;">
                        <div id="img-preview" style="margin-top:20px; text-align:center;">
                            ${p.img ? `<img src="${p.img}" style="max-width:100%; max-height:300px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">` : '<div style="color:#aaa; padding:40px;">Pré-visualização da imagem aparecerá aqui</div>'}
                        </div>
                    </div>
                    <button type="button" class="btn-adicionar" style="width:100%; padding:14px; font-size:16px; font-weight:600; margin-top:10px;" onclick="salvarProdutoAdmin('${p.id}', ${novo})">
                        💾 Salvar Produto
                    </button>
                </form>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    toggleBodyScroll(false);

    // Scroll suave e scrollbar bonito
    const container = modal.querySelector('.admin-form-container');
    container.style.scrollbarWidth = 'thin';
    container.style.scrollbarColor = '#aaa #f1f1f1';

    const fileInput = document.getElementById('adm-img-file');
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                document.getElementById('img-preview').innerHTML = `<img src="${ev.target.result}" style="max-width:100%; max-height:300px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">`;
            };
            reader.readAsDataURL(file);
        }
    });
}
window.salvarProdutoAdmin = (id, novo) => {
    const nome = document.getElementById('adm-nome').value.trim();
    const preco = parseFloat(document.getElementById('adm-preco').value);
    const desc = document.getElementById('adm-desc').value.trim();
    const category = document.getElementById('adm-cat').value.trim();
    const sizes = document.getElementById('adm-sizes').value.split(',').map(s => s.trim()).filter(s => s);
    const colors = document.getElementById('adm-colors').value.split(',').map(c => c.trim()).filter(c => c);
    const stockQuantity = parseInt(document.getElementById('adm-stock').value) || 0;
    const isLimitedEdition = document.getElementById('adm-limited').checked;
    const isOutOfStock = document.getElementById('adm-outofstock').checked;
    const imgUrl = document.getElementById('adm-img-url').value.trim();
    let img = imgUrl;
    const previewImg = document.querySelector('#img-preview img');
    if (previewImg && previewImg.src) {
        img = previewImg.src;
    }
    if (!nome || isNaN(preco) || preco <= 0 || !desc || !category || sizes.length === 0 || colors.length === 0 || !img) {
        alert('Por favor, preencha todos os campos obrigatórios corretamente.');
        return;
    }
    const produto = { id, nome, preco, desc, img, category, sizes, colors, stockQuantity, isLimitedEdition, isOutOfStock };
    if (novo) {
        produtosMock.push(produto);
    } else {
        const i = produtosMock.findIndex(p => p.id === id);
        if (i !== -1) {
            produtosMock[i] = produto;
        }
    }
    salvarProdutos();
    fecharModal('modalEdit');
    renderizarProdutos();
};