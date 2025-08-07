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

  // 初始化默认人员
  useEffect(() => {
    const defaultPersons = [
      { id: 1, name: generateRandomName() },
      { id: 2, name: generateRandomName() },
      { id: 3, name: generateRandomName() }
    ];
    setPersons(defaultPersons);
    setNextPersonId(4);
  }, []);

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
    if (data.persons) {
      const maxId = Math.max(...persons.map(p => p.id), 0);
      const newPersons = data.persons.map((person, index) => ({
        id: maxId + index + 1,
        name: person.name
      }));
      setPersons([...persons, ...newPersons]);
      setNextPersonId(maxId + newPersons.length + 1);
    }

    if (data.expenses) {
      const newExpenses = data.expenses.map(expense => ({
        id: Date.now() + Math.random(),
        ...expense,
        time: '12:00:00',
        timestamp: new Date(`${expense.date}T12:00:00`).toISOString()
      }));
      setExpenses([...expenses, ...newExpenses]);
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
