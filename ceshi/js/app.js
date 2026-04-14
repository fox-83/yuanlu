document.addEventListener('DOMContentLoaded', () => {
  const message = document.createElement('p');
  message.textContent = '项目已创建，文件已经分类到对应目录。';
  message.style.marginTop = '16px';
  document.body.appendChild(message);
});
