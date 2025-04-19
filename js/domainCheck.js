document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.domain-check-form');
    const resultContainer = document.createElement('div');
    resultContainer.className = 'domain-results';
    form.parentNode.insertBefore(resultContainer, form.nextSibling);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const domainInput = form.querySelector('input[name="domain"]');
        const domain = domainInput.value.trim();
        
        // Валидация формата
        if (!/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(domain)) {
            showResult('Пожалуйста, введите корректное доменное имя (например: example.ru)', 'error');
            return;
        }

        try {
            showResult('Проверяем доступность...', 'loading');
            
            // Заглушка для API запроса
            const isAvailable = await checkDomainAvailability(domain);
            
            showResult(isAvailable ? 
                `✅ Домен ${domain} доступен для регистрации!` :
                `❌ Домен ${domain} уже занят`, 
                isAvailable ? 'success' : 'error'
            );
        } catch (error) {
            showResult('Ошибка при проверке домена', 'error');
        }
    });

    async function checkDomainAvailability(domain) {
        // Заглушка для реального API запроса
        await new Promise(resolve => setTimeout(resolve, 1000));
        return Math.random() > 0.5; // Рандомная доступность для демонстрации
    }

    function showResult(message, type) {
        resultContainer.innerHTML = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;
    }
});