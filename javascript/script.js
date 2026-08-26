// Inicializar Painel de Checkboxes
        function initCheckboxes() {
            const grid = document.getElementById('checkboxGrid');
            const rows = document.querySelectorAll('#medTable tbody tr:not(.cat-row)');
            
            // Iniciar com apenas alguns selecionados por padrão para exibição inicial limpa
            const selecionadosPadrao = ['med-rivotril', 'med-gardenal', 'med-haldol'];

            rows.forEach(tr => {
                const id = tr.id;
                const nome = tr.querySelector('.col-medicamento').childNodes[0].textContent.trim();
                const isChecked = selecionadosPadrao.includes(id);

                const item = document.createElement('label');
                item.className = 'checkbox-item';
                item.innerHTML = `
                    <input type="checkbox" data-target="${id}" ${isChecked ? 'checked' : ''} onchange="atualizarVisibilidade()">
                    <span>${nome}</span>
                `;
                grid.appendChild(item);

                if (!isChecked) {
                    tr.classList.add('hidden');
                }
            });

            atualizarVisibilidade();
        }

        // Atualizar visibilidade das linhas e categorias
        function atualizarVisibilidade() {
            const checkboxes = document.querySelectorAll('#checkboxGrid input[type="checkbox"]');
            let visiveisGotas = 0;
            let visiveisColirios = 0;
            let visiveisGeral = 0;

            checkboxes.forEach(cb => {
                const tr = document.getElementById(cb.dataset.target);
                if (cb.checked) {
                    tr.classList.remove('hidden');
                    if (tr.dataset.cat === 'gotas') visiveisGotas++;
                    if (tr.dataset.cat === 'colirios') visiveisColirios++;
                    if (tr.dataset.cat === 'geral') visiveisGeral++;
                } else {
                    tr.classList.add('hidden');
                }
            });

            // Gerenciar os cabeçalhos de categoria (quando não houver nenhum medicamento visível, esconde o cabeçalho)
            const catGotas = document.querySelector('.cat-row[data-cat="gotas"]');
            const catColirios = document.querySelector('.cat-row[data-cat="colirios"]');
            const catGeral = document.querySelector('.cat-row[data-cat="geral"]');

            if (visiveisGotas > 0) catGotas.classList.remove('hidden');
            else catGotas.classList.add('hidden');

            if (visiveisColirios > 0) catColirios.classList.remove('hidden');
            else catColirios.classList.add('hidden');

            if (visiveisGeral > 0) catGeral.classList.remove('hidden');
            else catGeral.classList.add('hidden');

            // Exibir mensagem se nada estiver selecionado
            const emptyMsg = document.getElementById('emptyMsg');
            const table = document.getElementById('medTable');
            if (visiveisGotas === 0 && visiveisColirios === 0 && visiveisGeral === 0) {
                emptyMsg.classList.remove('hidden');
                table.classList.add('hidden');
            } else {
                emptyMsg.classList.add('hidden');
                table.classList.remove('hidden');
            }
        }

        /*
        // Funções de atalho: Marcar / Desmarcar todos
        function toggleTodos(status) {
            document.querySelectorAll('#checkboxGrid input[type="checkbox"]').forEach(cb => {
                // Se a caixa estiver visível na busca, aplica o status
                if (cb.closest('.checkbox-item').style.display !== 'none') {
                    cb.checked = status;
                }
            });
            atualizarVisibilidade();
        }

        // Filtro da caixa de busca
        function filtrarOpcoes() {
            const termo = document.getElementById('searchBox').value.toLowerCase();
            document.querySelectorAll('#checkboxGrid .checkbox-item').forEach(item => {
                const texto = item.textContent.toLowerCase();
                if (texto.includes(termo)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        */

        // Função de Cálculo
        function calcular(inputElement) {
            const tr = inputElement.closest('tr');
            const gotasDia = parseFloat(inputElement.value) || 0;
            
            const volFrasco = parseFloat(tr.dataset.vol) || 20;
            const fatorGotejador = parseFloat(tr.dataset.fator) || 20;
            const totalGotasFrasco = parseFloat(tr.dataset.totalgotas) || (volFrasco * fatorGotejador);

            const res30 = tr.querySelector('.res-30');
            const resDuracao = tr.querySelector('.res-duracao');

            if (gotasDia <= 0) {
                res30.innerText = "0,00";
                resDuracao.innerText = "0 Meses";
                return;
            }

            const totalGotas30 = gotasDia * 30;
            const frascos30 = totalGotas30 / totalGotasFrasco;

            const diasDuracao = totalGotasFrasco / gotasDia;
            const mesesDuracao = diasDuracao / 30;

            res30.innerText = frascos30.toFixed(2).replace('.', ',');
            
            if (mesesDuracao >= 1) {
                resDuracao.innerText = mesesDuracao.toFixed(1).replace('.', ',') + " Meses";
            } else {
                resDuracao.innerText = Math.round(diasDuracao) + " Dias";
            }
        }

        // Inicialização
        document.addEventListener("DOMContentLoaded", () => {
            initCheckboxes();
            document.querySelectorAll('.input-gotas').forEach(input => calcular(input));
        });