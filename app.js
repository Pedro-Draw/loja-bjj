// produtos.js
import { produtosMock as produtosOriginais } from './produtos.js';

let produtosMock = (JSON.parse(localStorage.getItem('produtosLoja')) || [...produtosOriginais]).map(p => ({
    ...p,
    stockQuantity: p.stockQuantity ?? 10,
    isLimitedEdition: p.isLimitedEdition ?? false,
    isOutOfStock: p.isOutOfStock ?? false
}));

// ✅ ADICIONADO: Carregar carrinho do localStorage
let carrinho = JSON.parse(localStorage.getItem('carrinhoLoja')) || [];

let favoritos = JSON.parse(localStorage.getItem('favoritosLoja')) || [];
let filtroCategoria = localStorage.getItem('filtroCategoria') || '';
let filtroPromocao = localStorage.getItem('filtroPromocao') === 'true';      // NOVO
let filtroLimitado = localStorage.getItem('filtroLimitado') === 'true';      // NOVO
let ordenacaoPreco = localStorage.getItem('ordenacaoPreco') || '';           // NOVO: '' | 'asc' | 'desc'
let isAdmin = localStorage.getItem('isAdminLoja') === 'true';

function salvarProdutos() {
    localStorage.setItem('produtosLoja', JSON.stringify(produtosMock));
}

function salvarFavoritos() {
    localStorage.setItem('favoritosLoja', JSON.stringify(favoritos));
}

// ✅ ADICIONADO: Função para salvar o carrinho
function salvarCarrinho() {
    localStorage.setItem('carrinhoLoja', JSON.stringify(carrinho));
}

// ✅ ADICIONADO: Salvar estados simples (filtro, admin, busca, scroll)
function salvarEstado() {
    localStorage.setItem('filtroCategoria', filtroCategoria);
    localStorage.setItem('filtroPromocao', filtroPromocao);
    localStorage.setItem('filtroLimitado', filtroLimitado);
    localStorage.setItem('ordenacaoPreco', ordenacaoPreco);
    localStorage.setItem('isAdminLoja', isAdmin);
    const inputBusca = document.getElementById('inputBusca');
    if (inputBusca) {
        localStorage.setItem('textoBusca', inputBusca.value);
    }
    const conteudo = document.querySelector('.conteudo-rolavel');
    if (conteudo) {
        localStorage.setItem('scrollPosition', conteudo.scrollTop);
    }
}

// ✅ ADICIONADO: Função central que chama tudo que precisa salvar com frequência
function salvarTudo() {
    salvarCarrinho();
    salvarFavoritos();
    salvarEstado();
}

function toggleBodyScroll(enable) {
    document.body.style.overflow = enable ? '' : 'hidden';
}

// INICIALIZAR
document.addEventListener('DOMContentLoaded', () => {
    // ✅ Restaurar busca salva
    const inputBusca = document.getElementById('inputBusca');
    const buscaSalva = localStorage.getItem('textoBusca');
    if (buscaSalva !== null) {
        inputBusca.value = buscaSalva;
    }

    // ✅ Restaurar filtro de categoria
    if (filtroCategoria) {
        document.querySelectorAll('.filtro-btn[data-categoria]').forEach(b => b.classList.remove('active'));
        const btnAtivo = document.querySelector(`.filtro-btn[data-categoria="${filtroCategoria}"]`);
        if (btnAtivo) btnAtivo.classList.add('active');
    }

    // ✅ Restaurar filtro de promoção
    if (filtroPromocao) {
        const btn = document.querySelector('.filtro-btn[data-filtro="promocao"]');
        if (btn) btn.classList.add('active');
    }

    // ✅ Restaurar filtro de limitados
    if (filtroLimitado) {
        const btn = document.querySelector('.filtro-btn[data-filtro="limitado"]');
        if (btn) btn.classList.add('active');
    }

    // ✅ Restaurar ordenação por preço
    const selectOrdenacao = document.getElementById('ordenacaoPreco');
    if (selectOrdenacao && ordenacaoPreco) {
        selectOrdenacao.value = ordenacaoPreco;
    }

    // ✅ Restaurar posição do scroll
    const conteudo = document.querySelector('.conteudo-rolavel');
    const scrollSalvo = localStorage.getItem('scrollPosition');
    if (conteudo && scrollSalvo) {
        conteudo.scrollTop = parseInt(scrollSalvo, 10);
    }

    // ✅ Salvar busca e filtro ao mudar
    inputBusca.addEventListener('input', salvarEstado);

    // ✅ Salvar scroll ao rolar
    conteudo.addEventListener('scroll', salvarEstado);

    renderizarProdutos();
    atualizarTudo(); // Atualiza badges com o carrinho carregado

    document.getElementById('btnCarrinho').onclick = () => toggleMenu('menuCarrinho');
    document.getElementById('btnFavoritos').onclick = () => toggleMenu('menuFavoritos');
    document.getElementById('btnAdmin').onclick = () => {
        if (isAdmin) {
            isAdmin = false;
            salvarEstado();
            alert('🔒 Modo ADMIN desativado');
            renderizarProdutos();
        } else {
            abrirAdminLogin();
        }
    };

    // Filtros de categoria (já existentes)
    document.querySelectorAll('.filtro-btn[data-categoria]').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filtro-btn[data-categoria]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtroCategoria = btn.dataset.categoria;
            salvarEstado();
            renderizarProdutos();
        };
    });

    // NOVO: Filtro Promoções
    document.querySelector('.filtro-btn[data-filtro="promocao"]')?.addEventListener('click', () => {
        const btn = document.querySelector('.filtro-btn[data-filtro="promocao"]');
        filtroPromocao = !filtroPromocao;
        if (filtroPromocao) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        salvarEstado();
        renderizarProdutos();
    });

    // NOVO: Filtro Limitados
    document.querySelector('.filtro-btn[data-filtro="limitado"]')?.addEventListener('click', () => {
        const btn = document.querySelector('.filtro-btn[data-filtro="limitado"]');
        filtroLimitado = !filtroLimitado;
        if (filtroLimitado) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        salvarEstado();
        renderizarProdutos();
    });

    // NOVO: Ordenação por preço
    document.getElementById('ordenacaoPreco')?.addEventListener('change', (e) => {
        ordenacaoPreco = e.target.value;
        salvarEstado();
        renderizarProdutos();
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

    let filtrados = produtosMock.filter(p =>
        p.nome.toLowerCase().includes(busca) &&
        (filtroCategoria === '' || p.category === filtroCategoria) &&
        (!filtroPromocao || p.preco <= 150) &&                   // ← Ajuste este valor se quiser mudar o limite de promoção
        (!filtroLimitado || p.isLimitedEdition === true)
    );

    // Ordenação por preço
    if (ordenacaoPreco === 'asc') {
        filtrados.sort((a, b) => a.preco - b.preco);
    } else if (ordenacaoPreco === 'desc') {
        filtrados.sort((a, b) => b.preco - a.preco);
    }

    grid.innerHTML = `
        ${isAdmin ? `
            <button class="btn-adicionar admin-add-btn" onclick="abrirAdminNovoProduto()">
                ➕ Novo Produto
            </button>
        ` : ''}
    ` + filtrados.map(p => {
        const precoFormatado = p.preco.toFixed(2).replace('.', ',');
        const isFavorito = favoritos.includes(p.id);
        return `
        <div class="produto-card ${isFavorito ? 'favorito' : ''}" onclick="abrirModal('${p.id}')">
            <img src="${p.img}" class="card-imagem" alt="${p.nome}">
            <div class="card-header">
                ${isAdmin ? `
                    <button onclick="event.stopPropagation(); abrirAdminEditar('${p.id}')" class="admin-edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                ` : `
                    <button onclick="event.stopPropagation(); toggleFav('${p.id}')" class="fav-btn">
                        <i class="fa${isFavorito ? 's' : 'r'} fa-heart"></i>
                    </button>
                `}
            </div>
            <div class="card-conteudo">
                <p class="card-nome">${p.nome}</p>
                <p class="card-descricao" id="desc-${p.id}">${p.desc}</p>
                <span class="ver-mais" id="toggle-${p.id}" onclick="event.stopPropagation(); toggleDesc('${p.id}')"></span>
                <p class="card-preco">R$ ${precoFormatado}</p>
                ${p.isLimitedEdition ? '<span class="badge-limited">Limitado</span>' : ''}
                ${p.isOutOfStock ? '<span class="badge-outstock">Esgotado</span>' : ''}
                <button class="btn-adicionar" onclick="event.stopPropagation(); abrirModal('${p.id}')" ${p.isOutOfStock ? 'disabled' : ''}>
                    ${p.isOutOfStock ? 'ESGOTADO' : 'ADICIONAR'}
                </button>
            </div>
        </div>
        `;
    }).join('');

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

// O RESTO DO CÓDIGO CONTINUA EXATAMENTE COMO VOCÊ TINHA (sem alterações)

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
            <p class="modal-desc">${p.desc}</p>
            <h2 class="modal-preco">R$ ${p.preco.toFixed(2)}</h2>
            ${p.isLimitedEdition ? '<span class="modal-badge-limited">Edição Limitada</span>' : ''}
            ${p.isOutOfStock ? '<span class="modal-badge-outstock">Esgotado</span>' : ''}
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
                ${p.isOutOfStock ? '<p class="outstock-msg">Produto Esgotado</p>' : `
                <button class="btn-adicionar modal-add-btn" onclick="addToCartWithOptions('${p.id}')">
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
    salvarTudo();
    atualizarTudo();
    renderizarCarrinho();
    toggleMenu('menuCarrinho');
    fecharModal();
};

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
    salvarTudo();
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
    salvarTudo();
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
    const instaUsername = "_pedrinsouzaa";
    const textoEncoded = encodeURIComponent(mensagem);
    window.open(`https://ig.me/m/${instaUsername}?text=${textoEncoded}`, "_blank");
};

function atualizarTudo() {
    document.getElementById('badgeCart').innerText = carrinho.length;
    document.getElementById('badgeFav').innerText = favoritos.length;
    salvarTudo();
}

function renderizarCarrinho() {
    const total = carrinho
        .filter(i => i.selected)
        .reduce((sum, item) => sum + (item.preco * item.qtd), 0);
    const totalFormatado = total.toFixed(2).replace('.', ',');
    const menu = document.getElementById('menuCarrinho');
    let itensHTML = '';
    if (carrinho.length === 0) {
        itensHTML = '<p class="empty-cart">Carrinho vazio</p>';
    } else {
        itensHTML = carrinho.map(item => {
            const subtotal = (item.preco * item.qtd).toFixed(2).replace('.', ',');
            return `
            <div class="item-carrinho">
                <input type="checkbox" class="circle-checkbox"
                       onclick="event.stopPropagation(); toggleSelect('${item.uniqueId}')"
                       ${item.selected ? 'checked' : ''}>
                <img src="${item.img}" alt="${item.nome}">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.nome}</p>
                    <p class="cart-item-details">
                        ${item.size} • ${item.color}
                    </p>
                    <p class="cart-item-price">
                        R$ ${subtotal}
                    </p>
                </div>
                <div class="qtd-controls">
                    <button onclick="event.stopPropagation(); changeQtd('${item.uniqueId}', -1)">-</button>
                    <span>${item.qtd}</span>
                    <button onclick="event.stopPropagation(); changeQtd('${item.uniqueId}', 1)">+</button>
                </div>
                <button class="btn-edit" onclick="event.stopPropagation(); abrirEdit('${item.uniqueId}')">Editar</button>
            </div>
        `;
        }).join('');
    }
    menu.innerHTML = `
    <div class="menu-header">
        <div class="header-left">
            <h2>Meu Carrinho (${carrinho.length})</h2>
            ${carrinho.length > 0 ?
                `<label class="select-all-label">
                    <input type="checkbox" class="circle-checkbox" id="selectAll" onclick="event.stopPropagation(); selectAll()">
                    Selecionar todos
                </label>`
            : ''}
        </div>
        <button class="close-btn" onclick="event.stopPropagation(); toggleMenu('menuCarrinho')">&times;</button>
    </div>
    <div class="menu-itens-container">
        ${itensHTML}
    </div>
    ${carrinho.length > 0 ? `
        <div class="cart-footer">
            <h3 class="total-price">
                Total: R$ ${totalFormatado}
            </h3>
            <button class="btn-checkout whatsapp-btn" onclick="event.stopPropagation(); finalizarNoWhatsApp()">
                Finalizar no WhatsApp
            </button>
            <button class="btn-checkout instagram-btn" onclick="event.stopPropagation(); finalizarNoInstagram()">
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
        ? '<p class="empty-fav">Nenhum favorito</p>'
        : favoritos.map(id => {
            const p = produtosMock.find(x => x.id === id);
            if (!p) return '';
            const precoFormatado = p.preco.toFixed(2).replace('.', ',');
            return `
                <div class="item-fav">
                    <img src="${p.img}" alt="${p.nome}">
                    <div class="fav-item-info">
                        <p class="fav-item-name">${p.nome}</p>
                        <p class="fav-item-price">R$ ${precoFormatado}</p>
                    </div>
                    <button class="btn-fav-remove" onclick="event.stopPropagation(); removerDosFavoritos('${id}')">Remover</button>
                    <button class="btn-fav-buy" onclick="event.stopPropagation(); abrirModal('${id}'); toggleMenu('menuFavoritos')">Comprar</button>
                </div>
            `;
          }).join('');
    menu.innerHTML = `
        <div class="menu-header">
            <h2>Meus Favoritos (${favoritos.length})</h2>
            <button class="close-btn" onclick="event.stopPropagation(); toggleMenu('menuFavoritos')">&times;</button>
        </div>
        <div class="menu-itens-container">
            ${itensFavoritosHTML}
        </div>
    `;
}

window.removerDosFavoritos = (id) => {
    favoritos = favoritos.filter(x => x !== id);
    salvarFavoritos();
    salvarTudo();
    atualizarTudo();
    renderizarProdutos();
    renderizarFavoritos();
};

let outsideClickHandler = null;

window.toggleMenu = (id) => {
    const menu = document.getElementById(id);
    if (!menu.classList.contains('aberto')) {
        document.querySelectorAll('.menu-lateral.aberto').forEach(m => {
            if (m.id !== id) m.classList.remove('aberto');
        });
        menu.classList.add('aberto');
        toggleBodyScroll(false);
        if (id === 'menuCarrinho') renderizarCarrinho();
        if (id === 'menuFavoritos') renderizarFavoritos();
        if (outsideClickHandler) {
            document.removeEventListener('click', outsideClickHandler);
        }
        outsideClickHandler = (e) => {
            if (!menu.contains(e.target)) {
                toggleMenu(id);
            }
        };
        setTimeout(() => document.addEventListener('click', outsideClickHandler), 0);
    } else {
        menu.classList.remove('aberto');
        toggleBodyScroll(true);
        if (outsideClickHandler) {
            document.removeEventListener('click', outsideClickHandler);
            outsideClickHandler = null;
        }
    }
};

window.toggleFav = (id) => {
    const index = favoritos.indexOf(id);
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        favoritos.push(id);
    }
    salvarFavoritos();
    salvarTudo();
    atualizarTudo();
    renderizarProdutos();
    if (document.getElementById('menuFavoritos').classList.contains('aberto')) {
        renderizarFavoritos();
    }
};

window.abrirAdminLogin = () => {
    const modal = document.getElementById('modalEdit');
    modal.innerHTML = `
        <div class="admin-login-modal">
            <button class="close-btn" onclick="fecharModal('modalEdit')">&times;</button>
            <h3 class="admin-login-title">🔐 Login Admin</h3>
            <form class="admin-login-form">
                <div class="form-group">
                    <label class="form-label">Email:</label>
                    <input id="admin-email" type="email" placeholder="Digite seu email" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Senha:</label>
                    <input id="admin-senha" type="password" placeholder="Digite sua senha" class="form-input" required>
                </div>
                <button type="button" class="btn-admin-login" onclick="verificarAdminLogin()">Entrar</button>
            </form>
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
        salvarEstado();
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
        <div class="admin-product-modal">
            <div class="admin-modal-header">
                <button class="close-btn" onclick="fecharModal('modalEdit')">&times;</button>
                <h3 class="admin-modal-title">${novo ? '➕ Novo Produto' : '✏️ Editar Produto'}</h3>
            </div>

            <div class="admin-form-container">
                <div class="admin-form-grid">
                    <div class="form-group">
                        <label class="form-label">Nome do produto</label>
                        <input id="adm-nome" type="text" placeholder="Ex: Kimono Ultra Light" value="${p.nome}" class="form-input">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Preço (R$)</label>
                        <input id="adm-preco" type="number" step="0.01" placeholder="0.00" value="${p.preco}" class="form-input">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea id="adm-desc" placeholder="Descrição detalhada do produto..." rows="5" class="form-textarea">${p.desc}</textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Categoria</label>
                        <input id="adm-cat" type="text" placeholder="Ex: Kimono, Rashguard, Acessório" value="${p.category}" class="form-input">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Tamanhos (separados por vírgula)</label>
                        <input id="adm-sizes" type="text" placeholder="A1, A2, A3, A4" value="${p.sizes.join(', ')}" class="form-input">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Cores (separadas por vírgula)</label>
                        <input id="adm-colors" type="text" placeholder="Branco, Preto, Azul" value="${p.colors.join(', ')}" class="form-input">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Quantidade em estoque</label>
                        <input id="adm-stock" type="number" min="0" placeholder="0" value="${p.stockQuantity}" class="form-input">
                    </div>

                    <div class="checkboxes-container">
                        <label class="checkbox-label">
                            <input id="adm-limited" type="checkbox" ${p.isLimitedEdition ? 'checked' : ''}>
                            <span class="checkbox-text">Edição Limitada</span>
                        </label>
                        <label class="checkbox-label">
                            <input id="adm-outofstock" type="checkbox" ${p.isOutOfStock ? 'checked' : ''}>
                            <span class="checkbox-text">Marcar como Esgotado</span>
                        </label>
                    </div>

                    <div class="form-group image-section">
                        <label class="form-label">Imagem do produto</label>
                        <input id="adm-img-url" type="text" placeholder="Cole a URL da imagem aqui" value="${p.img.startsWith('data:') ? '' : p.img}" class="form-input">
                        <p class="upload-hint">OU faça upload de uma imagem</p>
                        <input type="file" id="adm-img-file" accept="image/*" class="file-input">
                        
                        <div id="img-preview" class="img-preview">
                            ${p.img ? `
                                <img src="${p.img}" class="preview-img">
                            ` : `
                                <div class="preview-placeholder">
                                    Pré-visualização da imagem aparecerá aqui
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>

            <div class="admin-modal-footer">
                <button type="button" class="btn-save-product" onclick="salvarProdutoAdmin('${p.id}', ${novo})">
                    💾 Salvar Produto
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    toggleBodyScroll(false);

    const fileInput = document.getElementById('adm-img-file');
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                document.getElementById('img-preview').innerHTML = `
                    <img src="${ev.target.result}" class="preview-img">
                `;
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
    salvarTudo();
    fecharModal('modalEdit');
    renderizarProdutos();
};

document.getElementById('btnVoltarTopo').addEventListener('click', () => {
    const conteudo = document.querySelector('.conteudo-rolavel');
    conteudo.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});