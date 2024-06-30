# 使用Node.js官方镜像作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json文件到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 暴露需要的端口（如果你的应用使用特定端口）
EXPOSE 3000

# 运行应用
CMD ["node", "bot.js"]

