// 联系我们页面 - 留言板功能

document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const messagesList = document.getElementById('messagesList');

    // 从 localStorage 加载已有留言
    loadMessages();

    // 表单提交事件
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 获取表单数据
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        // 验证数据
        if (!name || !email || !message) {
            alert('请填写所有必填项！');
            return;
        }

        // 创建留言对象
        const newMessage = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            message: message,
            timestamp: new Date().toISOString()
        };

        // 保存留言
        saveMessage(newMessage);

        // 显示成功提示
        showSuccessMessage('留言提交成功！');

        // 重置表单
        messageForm.reset();

        // 重新加载留言列表
        loadMessages();
    });

    // 保存留言到 localStorage
    function saveMessage(message) {
        let messages = getMessages();
        messages.unshift(message); // 新留言添加到数组开头
        
        // 最多保存20条留言
        if (messages.length > 20) {
            messages = messages.slice(0, 20);
        }
        
        localStorage.setItem('ronghuaMessages', JSON.stringify(messages));
    }

    // 从 localStorage 获取所有留言
    function getMessages() {
        const messages = localStorage.getItem('ronghuaMessages');
        return messages ? JSON.parse(messages) : [];
    }

    // 加载并显示留言
    function loadMessages() {
        const messages = getMessages();
        
        if (messages.length === 0) {
            messagesList.innerHTML = '<div class="empty-message">暂无留言，快来留下第一条留言吧！</div>';
            return;
        }

        messagesList.innerHTML = '';
        
        messages.forEach(msg => {
            const messageElement = createMessageElement(msg);
            messagesList.appendChild(messageElement);
        });
    }

    // 创建留言元素
    function createMessageElement(msg) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-item';
        
        const formatTime = formatTimestamp(msg.timestamp);
        
        // 隐藏邮箱中间部分以保护隐私
        const maskedEmail = maskEmail(msg.email);
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <div>
                    <span class="message-author">${escapeHtml(msg.name)}</span>
                    <span class="message-email">${maskedEmail}</span>
                </div>
                <span class="message-time">${formatTime}</span>
            </div>
            <div class="message-content">${escapeHtml(msg.message)}</div>
        `;
        
        return messageDiv;
    }

    // 格式化时间戳
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        // 一分钟内
        if (diff < 60000) {
            return '刚刚';
        }
        
        // 一小时内
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes}分钟前`;
        }
        
        // 一天内
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours}小时前`;
        }
        
        // 一周内
        if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `${days}天前`;
        }
        
        // 超过一周，显示具体日期
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }

    // 隐藏邮箱中间部分
    function maskEmail(email) {
        const [username, domain] = email.split('@');
        if (username.length <= 3) {
            return `${username[0]}***@${domain}`;
        }
        const visiblePart = username.slice(0, 3);
        return `${visiblePart}***@${domain}`;
    }

    // 转义HTML特殊字符，防止XSS攻击
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // 显示成功提示消息
    function showSuccessMessage(text) {
        // 创建提示元素
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = text;
        document.body.appendChild(messageDiv);

        // 显示动画
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);

        // 3秒后移除
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }

    // 添加一些初始示例留言（仅在首次访问时）
    function addInitialMessages() {
        const messages = getMessages();
        if (messages.length === 0) {
            const initialMessages = [
                {
                    id: Date.now() - 3600000,
                    name: '张小华',
                    email: 'zhang@example.com',
                    phone: '',
                    message: '绒花工艺真的太精致了！上次参观了工作室，被师傅们的匠心所感动。希望这门传统手艺能够继续传承下去。',
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: Date.now() - 7200000,
                    name: '李文静',
                    email: 'li@example.com',
                    phone: '',
                    message: '非常喜欢南京绒花，每一件作品都是艺术品。想了解一下是否有体验课程可以参加？',
                    timestamp: new Date(Date.now() - 7200000).toISOString()
                }
            ];

            localStorage.setItem('ronghuaMessages', JSON.stringify(initialMessages));
        }
    }

    // 首次访问时添加示例留言
    addInitialMessages();
});


