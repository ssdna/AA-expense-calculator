import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExcelImport = ({ onImport }) => {
  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const result = {};
        
        // 读取人员表
        if (workbook.SheetNames.includes('人员表')) {
          const personSheet = workbook.Sheets['人员表'];
          const personData = XLSX.utils.sheet_to_json(personSheet);
          result.persons = personData.map(row => ({
            name: row['姓名'] || row['name'] || ''
          })).filter(person => person.name);
        }
        
        // 读取费用表
        if (workbook.SheetNames.includes('费用表')) {
          const expenseSheet = workbook.Sheets['费用表'];
          const expenseData = XLSX.utils.sheet_to_json(expenseSheet);
          result.expenses = expenseData.map(row => {
            const participantsStr = row['分摊人'] || row['participants'] || '';
            const participantNames = participantsStr ? 
              participantsStr.split(',').map(name => name.trim()).filter(name => name) : 
              [];
            
            return {
              amount: parseFloat(row['金额'] || row['amount'] || 0),
              description: row['说明'] || row['description'] || '',
              payerName: row['支付人'] || row['payer'] || '',
              participantNames: participantNames,
              date: row['日期'] || row['date'] || new Date().toISOString().split('T')[0]
            };
          }).filter(expense => expense.amount > 0 && expense.description && expense.participantNames.length > 0);
        }
        
        onImport(result);
        alert('Excel文件导入成功！');
        
      } catch (error) {
        console.error('Excel解析错误:', error);
        alert('Excel文件格式错误，请检查文件格式');
      }
    };
    
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const downloadTemplate = () => {
    const personData = [
      { '姓名': '张三' },
      { '姓名': '李四' },
      { '姓名': '王五' }
    ];

    const expenseData = [
      {
        '金额': 120.50,
        '说明': '午餐费用',
        '日期': '2024-01-15',
        '支付人': '张三',
        '分摊人': '张三,李四,王五'
      },
      {
        '金额': 45.00,
        '说明': '打车费',
        '日期': '2024-01-15',
        '支付人': '李四',
        '分摊人': '张三,李四'
      }
    ];

    const wb = XLSX.utils.book_new();
    
    const personWs = XLSX.utils.json_to_sheet(personData);
    XLSX.utils.book_append_sheet(wb, personWs, '人员表');
    
    const expenseWs = XLSX.utils.json_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(wb, expenseWs, '费用表');
    
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'AA制费用计算器模板.xlsx');
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Excel导入</h2>
      
      <div className="space-y-3">
        <div className="mobile-btn-group md:flex md:gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex-1 touch-target"
          >
            📁 导入Excel文件
          </button>
          <button
            onClick={downloadTemplate}
            className="btn-secondary flex-1 touch-target"
          >
            📥 下载模板
          </button>
        </div>

        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
          <div className="font-medium mb-1">📋 使用说明：</div>
          <ul className="space-y-0.5 text-xs">
            <li>• 点击"下载模板"获取标准Excel格式</li>
            <li>• Excel文件需包含"人员表"和"费用表"两个工作表</li>
            <li>• 人员表列名：姓名</li>
            <li>• 费用表列名：金额、说明、日期、支付人、分摊人</li>
            <li>• 分摊人用逗号分隔，如：张三,李四,王五</li>
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">选择Excel文件</h3>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="input-field mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelImport;
