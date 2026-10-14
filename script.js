document.addEventListener('DOMContentLoaded', function() {
  // 1. 获取 DOM 元素
  const slides = document.querySelector('.slides');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const dots = document.querySelectorAll('.dot');

  const realSlideCount = 3; // 真实幻灯片数量（不包含克隆）
  const slideCount = slides.children.length; // 总幻灯片数（5张：3真实+2克隆）
  let currentSlide = 1; // 当前索引：从1开始（对应真实第一张）

  // 2. 自动轮播：每5秒切换一次
  let autoSlide = setInterval(() => {
    currentSlide = (currentSlide + 1) % slideCount; // 循环切换（1→2→3→4→0→1...）
    updateSlider();
  }, 5000);

  // 3. 更新轮播位置 + 分页点状态
 function updateSlider() {
  slides.style.transform = `translateX(-${currentSlide * 100}%)`;
  // 计算真实幻灯片的索引（排除克隆）
  let realIndex = currentSlide - 1;
  if (realIndex < 0) realIndex = realSlideCount - 1; // 处理currentSlide=0（克隆最后一张）
  if (realIndex >= realSlideCount) realIndex = 0; // 处理currentSlide=4（克隆第一张）
  // 更新分页点激活状态
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === realIndex);
  });
}

  // 4. 上一张按钮
  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount; // 处理负数（如0→4）
    updateSlider();
    resetAutoSlide();
  });

  // 5. 下一张按钮
  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slideCount;
    updateSlider();
    resetAutoSlide();
  });

  // 6. 分页点点击
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index + 1; // 点击第N个分页点 → 切换到第N+1张（对应真实幻灯片）
      updateSlider();
      resetAutoSlide();
    });
  });

  // 7. 过渡后无缝跳转（核心！）
  slides.addEventListener('transitionend', function() {
  // 情况1：切换到克隆的第一张（索引4）→ 跳转到真实第一张（索引1）
  if (currentSlide === slideCount - 1) {
    slides.style.transition = 'none'; // 临时关闭过渡
    currentSlide = 1;
    updateSlider();
    slides.style.transition = 'transform 2s ease'; // 恢复过渡
  }
  // 情况2：切换到克隆的最后一张（索引0）→ 跳转到真实最后一张（索引3）
  if (currentSlide === 0) {
    slides.style.transition = 'none';
    currentSlide = realSlideCount; // 真实最后一张是索引3
    updateSlider();
    slides.style.transition = 'transform 2s ease'; // 恢复过渡
  }
});

  // 8. 重置自动轮播（手动操作后重新计时）
  function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      currentSlide = (currentSlide + 1) % slideCount;
      updateSlider();
    }, 5000);
  }

  // 初始化显示真实第一张
  updateSlider();
});



