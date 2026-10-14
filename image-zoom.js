// 图片放大功能脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const imageSource = document.getElementById('imageSource');
    const closeModal = document.querySelector('.close-modal');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const resetZoomBtn = document.querySelector('.reset-zoom');
    
    // 当前缩放级别
    let currentScale = 1;
    const minScale = 0.5;
    const maxScale = 5;
    const scaleStep = 0.1;
    
    // 获取所有可点击放大的图片
    const zoomableImages = document.querySelectorAll('.zoomable-image');
    
    // 为每个图片添加点击事件
    zoomableImages.forEach(img => {
        img.addEventListener('click', function() {
            // 设置模态框中显示的图片和来源
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            
            // 设置图片来源
            const source = this.getAttribute('data-source');
            imageSource.textContent = `图片来源: ${source}`;
            
            // 重置缩放级别
            resetZoom();
            
            // 显示模态框
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    });
    
    // 关闭模态框
    function closeImageModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    }
    
    // 点击关闭按钮
    closeModal.addEventListener('click', closeImageModal);
    
    // 点击模态框背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // 按ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
    });
    
    // 放大图片
    function zoomIn() {
        if (currentScale < maxScale) {
            currentScale += scaleStep;
            updateImageScale();
        }
    }
    
    // 缩小图片
    function zoomOut() {
        if (currentScale > minScale) {
            currentScale -= scaleStep;
            updateImageScale();
        }
    }
    
    // 重置缩放
    function resetZoom() {
        currentScale = 1;
        updateImageScale();
    }
    
    // 更新图片缩放
    function updateImageScale() {
        modalImage.style.transform = `scale(${currentScale})`;
    }
    
    // 为控制按钮添加事件
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    resetZoomBtn.addEventListener('click', resetZoom);
    
    // 鼠标滚轮缩放
    modalImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        // 判断滚轮方向
        if (e.deltaY < 0) {
            // 向上滚动，放大
            zoomIn();
        } else {
            // 向下滚动，缩小
            zoomOut();
        }
    });
    
    // 触摸屏双指缩放支持
    let initialDistance = null;
    
    modalImage.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            // 计算两个触摸点之间的初始距离
            initialDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    });
    
    modalImage.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2 && initialDistance !== null) {
            e.preventDefault();
            
            // 计算当前两个触摸点之间的距离
            const currentDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            
            // 计算缩放比例变化
            const scaleChange = currentDistance / initialDistance;
            
            // 更新缩放级别
            const newScale = currentScale * scaleChange;
            
            // 限制缩放范围
            if (newScale >= minScale && newScale <= maxScale) {
                currentScale = newScale;
                updateImageScale();
            }
            
            // 更新初始距离
            initialDistance = currentDistance;
        }
    });
    
    modalImage.addEventListener('touchend', function() {
        initialDistance = null;
    });
    
    // 为图片添加悬停提示
    zoomableImages.forEach(img => {
        // 添加标题提示
        img.title = "点击查看大图";
        
        // 添加键盘访问支持
        img.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});