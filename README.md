# AA制费用计算器

一个功能完整的AA制费用分摊计算器，支持多人费用管理、智能结算方案生成和Excel数据导入导出。

## 🎯 功能特性

### 核心功能
- **人员管理**：支持添加、编辑、删除参与人员，自动生成百家姓随机姓名
- **费用录入**：完整的费用信息录入，支持灵活的分摊人员选择
- **智能计算**：实时计算个人费用明细和最优结算方案
- **数据导入导出**：支持Excel文件的批量导入和一键导出

### 计算功能
- 自动计算总费用和个人费用汇总
- 实时显示每人的支付金额、应分摊金额和余额
- 智能生成最少转账次数的结算方案
- 精确处理小数点计算，避免浮点数误差

### 数据管理
- **Excel导入**：支持标准格式的Excel文件批量导入
- **Excel导出**：一键导出包含人员表、费用表和汇总表的完整Excel文件
- **数据验证**：完整的数据完整性检查和错误提示

## 🚀 快速开始

### 在线使用
访问 [GitHub Pages 部署地址](https://your-username.github.io/aa-expense-calculator/) 直接使用

### 本地开发

```bash
# 克隆项目
git clone https://github.com/your-username/aa-expense-calculator.git
cd aa-expense-calculator

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📊 使用说明

### 基本使用流程
1. **添加人员**：在"参与人员管理"中添加所有参与者
2. **录入费用**：在"费用录入"中添加每笔费用的详细信息
3. **查看汇总**：在"费用汇总"中查看每个人的费用明细
4. **结算方案**：在"结算方案"中查看最优转账方案

### Excel导入导出
- **导入**：点击"导入Excel文件"，选择符合模板格式的Excel文件
- **导出**：点击"一键导出Excel文件"，保存当前所有数据
- **模板**：点击"下载模板"获取标准Excel格式

### Excel文件格式
Excel文件需包含以下工作表：

**人员表**
| 姓名 |
|------|
| 张三 |
| 李四 |

**费用表**
| 金额 | 说明 | 日期 | 支付人 | 分摊人 |
|------|------|------|--------|--------|
| 120.50 | 午餐费用 | 2024-01-15 | 张三 | 张三,李四,王五 |

## 🧮 计算原理

### 个人费用计算
- **已支付金额** = 该人作为支付人的所有费用总和
- **应分摊金额** = 该人参与分摊的费用按人数平分后的总和
- **个人余额** = 已支付金额 - 应分摊金额

### 结算算法
采用贪心算法，每次选择债权人和债务人中金额最小的进行结算，确保：
- 转账次数最少
- 所有人最终余额为0
- 精确处理小数点精度

## 🛠 技术栈

- **前端框架**：React 18
- **构建工具**：Webpack 5
- **样式方案**：Tailwind CSS
- **Excel处理**：SheetJS (xlsx)
- **文件下载**：FileSaver.js
- **部署平台**：GitHub Pages

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── PersonManager.jsx      # 人员管理
│   ├── ExpenseManager.jsx     # 费用录入
│   ├── ExpenseList.jsx        # 费用列表
│   ├── Summary.jsx            # 费用汇总
│   ├── Settlement.jsx         # 结算方案
│   ├── ExcelImport.jsx        # Excel导入
│   └── ExcelExport.jsx        # Excel导出
├── utils/               # 工具函数
│   ├── nameGenerator.js       # 姓名生成器
│   └── calculator.js          # 计算逻辑
├── styles/              # 样式文件
│   └── index.css              # 全局样式
├── App.jsx              # 主应用组件
└── index.jsx            # 应用入口

tests/                   # 测试文件
├── test-data-*.xlsx     # 测试数据文件
├── validation-report.md # 验证报告
└── generate-test-data.js # 测试数据生成脚本
```

## 🧪 测试验证

项目包含完整的测试数据和验证机制：

```bash
# 生成测试数据
node tests/generate-test-data.js

# 验证计算准确性
node tests/manual-verification.js
```

测试文件包含：
- 5个不同规模的测试Excel文件（3-10人，10-100条费用）
- 完整的计算验证报告
- 边界情况和精度测试

## 🚀 部署

项目支持自动部署到GitHub Pages：

1. Fork本项目到你的GitHub账户
2. 在项目设置中启用GitHub Pages
3. 推送代码到main分支，自动触发部署
4. 访问 `https://your-username.github.io/aa-expense-calculator/`

### 自定义域名
如需使用自定义域名，在 `.github/workflows/deploy.yml` 中设置 `cname` 字段。

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [SheetJS](https://sheetjs.com/) - Excel文件处理
- [Webpack](https://webpack.js.org/) - 模块打包工具

---

如有问题或建议，欢迎提交Issue或联系开发者！
