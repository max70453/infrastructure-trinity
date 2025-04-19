$(document).ready(function() {
    // Анимация карточек гарантий
    $('.guarantee-card').hover(
        function() {
            $(this).css({
                'transform': 'translateY(-10px)',
                'box-shadow': '0 12px 30px rgba(0, 123, 255, 0.2)',
                'transition': 'all 0.3s ease'
            });
            $(this).find('.guarantee-badge').tooltip('show');
        },
        function() {
            $(this).css({
                'transform': 'none',
                'box-shadow': '0 5px 15px rgba(0,0,0,0.1)'
            });
            $(this).find('.guarantee-badge').tooltip('hide');
        }
    );

    // Динамическая загрузка контента гарантий
    $('.guarantee-card').on('click', function() {
        const guaranteeId = $(this).data('guarantee-id');
        const $modal = $('#guaranteeModal');
        
        $modal.find('.modal-content').load(`/api/guarantees/${guaranteeId}`, function() {
            $modal.addClass('show').fadeIn(300);
            initGuaranteeFormValidation();
            trackAnalyticsEvent('guarantee_view', {id: guaranteeId});
        });
    });

    // Валидация формы в модальном окне
    function initGuaranteeFormValidation() {
        $('#guaranteeForm').off('submit').on('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            $(this).find('[required]').each(function() {
                if (!$(this).val()) {
                    $(this).addClass('is-invalid');
                    isValid = false;
                } else {
                    $(this).removeClass('is-invalid');
                }
            });

            if (isValid) {
                submitGuaranteeForm($(this));
            }
        });
    }

    // Отправка формы гарантии
    function submitGuaranteeForm($form) {
        $form.find('.submit-btn')
            .prop('disabled', true)
            .html('<i class="fa fa-spinner fa-spin"></i> Отправка...');

        $.ajax({
            url: '/api/guarantees/submit',
            method: 'POST',
            data: $form.serialize(),
            success: function(response) {
                showFormSuccessNotification();
                trackAnalyticsEvent('guarantee_submit', {id: response.id});
            },
            complete: function() {
                $form.find('.submit-btn')
                    .prop('disabled', false)
                    .text('Отправить');
            }
        });
    }

    // Трекинг событий аналитики
    function trackAnalyticsEvent(eventType, data) {
        $.post('/api/analytics', {
            event: eventType,
            ...data,
            timestamp: new Date().toISOString()
        });
    }
        // Обработчик кнопок 'Читать дальше' в секции гарантий
    $('.read-more-guarantee').on('click', function(e) {
        e.preventDefault();
        const modalId = $(this).data('modal');
        console.log(modalId);
        
        if (modalId && $(`#${modalId}`).length) {
            const $modal = $(`#${modalId}`);
            if ($modal.length) {
                $modal.addClass('show').fadeIn(300);
                $('body').css('overflow', 'hidden');
            }
        }
    });
    
    // Закрытие модального окна при клике вне его
    $(document).on('click', function(e) {
        if ($(e.target).hasClass('modal-guarantee')) {
            $('.modal-guarantee.show').fadeOut(300, function() {
                $(this).removeClass('show');
                $('body').css('overflow', 'auto');
            });
        }
    });

     // Обработчик закрытия модальных окон
     $('.modal-guarantee-close').on('click', function(e) {
        e.preventDefault();
        const $modal = $(this).closest('.modal-guarantee');
        if ($modal.length) {
            $modal.fadeOut(300, function() {
                $(this).removeClass('show');
                $('body').css('overflow', 'auto');
            });
        }
    });
    
    // Обработчик формы контактов
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // Валидация полей
        let isValid = true;
        $(this).find('input[required], textarea[required]').each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        if (!isValid) return;
        
        // Показать загрузку
        $('#contactSubmit').prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Отправка...');
        
        // AJAX запрос
        // Имитация отправки формы
            setTimeout(() => {
                $('#contactSubmit').html('Отправить').prop('disabled', false);
                $('#contactForm')[0].reset();
                $('#contactStatus').html('<div class="alert alert-success">Сообщение успешно отправлено!</div>');
                setTimeout(() => $('#contactStatus').empty(), 5000);
                
                // Показать всплывающее уведомление
                alert('Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
                
                // Альтернативный вариант - показать уведомление на странице
                $('body').append('<div class="fixed-notification">Сообщение отправлено!</div>');
                setTimeout(() => $('.fixed-notification').fadeOut(), 3000);
            }, 1000);
    });
    
    // Обработчик формы проверки домена
    $('.domain-check-form').on('submit', function(e) {
        e.preventDefault();
        
        const domainInput = $(this).find('input[name="domain"]');
        if (!domainInput.val()) {
            domainInput.addClass('is-invalid');
            return;
        }
        
        domainInput.removeClass('is-invalid');
        
        // Показать загрузку
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Проверка...');
        
        // AJAX запрос
        $.ajax({
            url: 'check_domain.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                submitBtn.html(originalText).prop('disabled', false);
                $('.domain-results').html(response);
            },
            error: function() {
                submitBtn.html(originalText).prop('disabled', false);
                $('.domain-results').html('<div class="alert alert-danger">Ошибка проверки домена. Попробуйте позже.</div>');
            }
        });
    });
    
    // Сброс ошибок при вводе
    $('#contactForm input, #contactForm textarea').on('input', function() {
        $(this).removeClass('is-invalid');
    });
});


// Обработчики для секции технологий
  // Анимация при наведении на технологические блоки
    document.querySelectorAll('.tech-box').forEach(box => {
      // Анимация иконки при клике
      const icon = box.querySelector('.tech-icon');
      if (icon) {
        box.addEventListener('click', () => {
          icon.classList.toggle('active');
        });
      }
    box.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 8px 25px rgba(0,123,255,0.15)';
    });
    
    box.addEventListener('mouseleave', function() {
      this.style.transform = 'none';
      this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
    });
  });


function TechDetails() {
    const data = { 
      name: 'Docker', 
      description: 'Docker — программная платформа для разработки, доставки и запуска контейнерных приложений',
      examples: `
        <ul>
          <li>Автоматизация тестирования.</li>
          <li>Масштабируемость и гибкость.</li>
          <li>Тестирование и создание прототипов.</li>
          <li>Управление данными.</li>
        </ul>
        `,
      url: '<a href="https://docs.docker.com/">docker.com</a>'
    }
      showTechModal(data);
}

const bage = document.querySelector('.tech-bage');
bage.addEventListener('click', function(){
  TechDetails();
});


function showTechModal(data) {
  const modal = document.createElement('div');
  modal.className = 'tech-modal';
  modal.innerHTML = `
    <div class="tech-modal-content">
      <span class="tech-modal-close">&times;</span>
      <h2>${data.name}</h2>
      <p>${data.description}</p>
      <h3>Примеры использования: </h3>
      <div>${data.examples}</div>
      <h3>Документация: ${data.url}</h3>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'flex';

  const closeBtn = modal.querySelector('.tech-modal-close');
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}




