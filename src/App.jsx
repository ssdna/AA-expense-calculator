import React, { useState, useEffect } from 'react';
import PersonManager from './components/PersonManager';
import ExpenseManager from './components/ExpenseManager';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import Settlement from './components/Settlement';
import ExcelImport from './components/ExcelImport';
import ExcelExport from './components/ExcelExport';
import { generateRandomName } from './utils/nameGenerator';
import { calculateSettlement } from './utils/calculator';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [nextPersonId, setNextPersonId] = useState(1);

  // 不初始化默认人员，保持空列表
  // useEffect(() => {
  //   const defaultPersons = [
  //     { id: 1, name: generateRandomName() },
  //     { id: 2, name: generateRandomName() },
  //     { id: 3, name: generateRandomName() }
  //   ];
  //   setPersons(defaultPersons);
  //   setNextPersonId(4);
  // }, []);

  const addPerson = (name) => {
    const newPerson = {
      id: nextPersonId,
      name: name || generateRandomName()
    };
    setPersons([...persons, newPerson]);
    setNextPersonId(nextPersonId + 1);
  };

  const updatePerson = (id, name) => {
    setPersons(persons.map(person => 
      person.id === id ? { ...person, name } : person
    ));
  };

  const deletePerson = (id) => {
    setPersons(persons.filter(person => person.id !== id));
    setExpenses(expenses.filter(expense => 
      expense.payerId !== id && !expense.participants.includes(id)
    ));
  };

  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now(),
      ...expense,
      timestamp: new Date(`${expense.date}T${expense.time || '00:00:00'}`).toISOString()
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleExcelImport = (data) => {
    let importedPersons = [...persons];
    let nextId = nextPersonId;

    // 处理人员导入
    if (data.persons && data.persons.length > 0) {
      const maxId = Math.max(...persons.map(p => p.id), 0);
      const newPersons = data.persons.map((person, index) => ({
        id: maxId + index + 1,
        name: person.name
      }));
      importedPersons = [...persons, ...newPersons];
      setPersons(importedPersons);
      nextId = maxId + newPersons.length + 1;
      setNextPersonId(nextId);
    }

    // 处理费用导入
    if (data.expenses && data.expenses.length > 0) {
      const validExpenses = [];
      
      data.expenses.forEach(expense => {
        // 查找支付人ID
        const payer = importedPersons.find(p => p.name === expense.payerName);
        if (!payer) {
          console.warn(`支付人"${expense.payerName}"不在人员列表中，跳过该费用记录`);
          return;
        }

        // 查找分摊人ID
        const participantIds = [];
        expense.participantNames.forEach(name => {
          const participant = importedPersons.find(p => p.name === name);
          if (participant) {
            participantIds.push(participant.id);
          } else {
            console.warn(`分摊人"${name}"不在人员列表中`);
          }
        });

        if (participantIds.length === 0) {
          console.warn(`费用"${expense.description}"没有有效的分摊人，跳过该记录`);
          return;
        }

        // 创建有效的费用记录
        validExpenses.push({
          id: Date.now() + Math.random(),
          amount: expense.amount,
          description: expense.description,
          payerId: payer.id,
          participants: participantIds,
          date: expense.date,
          time: '12:00:00',
          timestamp: new Date(`${expense.date}T12:00:00`).toISOString()
        });
      });

      if (validExpenses.length > 0) {
        setExpenses([...expenses, ...validExpenses]);
      }
    }
  };

  const settlement = calculateSettlement(persons, expenses);

  return (
    <div className="app">
      <div className="container mx-auto px-2 py-4 md:px-4 md:py-8">
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-white mb-1">AA制费用计算器</h1>
          <p className="text-xs md:text-sm text-white opacity-90">智能分摊，精确计算，让聚餐买单不再烦恼</p>
        </div>

        {/* 移动端单列布局，桌面端双列布局 */}
        <div className="mobile-grid md:tablet-grid lg:desktop-grid">
          {/* 左侧功能区 */}
          <div className="space-y-3 md:space-y-4">
            <PersonManager 
              persons={persons}
              onAdd={addPerson}
              onUpdate={updatePerson}
              onDelete={deletePerson}
            />
            
            <ExpenseManager 
              persons={persons}
              onAdd={addExpense}
            />
          </div>

          {/* 右侧显示区 */}
          <div className="space-y-3 md:space-y-4">
            <ExpenseList 
              expenses={expenses}
              persons={persons}
              onUpdate={updateExpense}
              onDelete={deleteExpense}
            />
            
            <Summary 
              persons={persons}
              expenses={expenses}
            />
            
            <Settlement settlement={settlement} />
          </div>
        </div>

        {/* 导入导出功能移至页面底部 */}
        <div className="mt-6 md:mt-8 pt-4 border-t border-white border-opacity-20">
          <div className="text-center mb-3">
            <h2 className="text-base md:text-lg font-semibold text-white mb-1">数据管理</h2>
            <p className="text-xs text-white opacity-75">导入导出Excel文件，便于数据备份和分享</p>
          </div>
          
          <div className="mobile-grid md:grid md:grid-cols-2 md:gap-4 lg:max-w-3xl lg:mx-auto">
            <ExcelImport onImport={handleExcelImport} />
            
            <ExcelExport 
              persons={persons}
              expenses={expenses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
