# 使用官方 Node 20 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 Procfile
COPY package.json Procfile ./

# 安装依赖
RUN npm install

# 确保基础环境配置好后，提前安装 supergateway 和 sequential-thinking 服务
RUN npm install -g supergateway @modelcontextprotocol/server-sequential-thinking

# 其他拷贝文件或常规依赖安装的指令...
# COPY package.json .
# RUN npm install

# 复制其余文件
COPY . .

# 暴露端口（dcdeploy 会注入 $PORT）
EXPOSE $PORT

# 启动命令
CMD ["npm", "start"]
