export const calculatePersonSummary = (person, expenses) => {
  let totalPaid = 0;
  let totalShould = 0;

  expenses.forEach(expense => {
    if (expense.payerId === person.id) {
      totalPaid += expense.amount;
    }
    
    if (expense.participants && expense.participants.includes(person.id)) {
      totalShould += expense.amount / expense.participants.length;
    }
  });

  return {
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalShould: Math.round(totalShould * 100) / 100,
    balance: Math.round((totalPaid - totalShould) * 100) / 100
  };
};

export const calculateSettlement = (persons, expenses) => {
  const balances = {};
  
  persons.forEach(person => {
    const summary = calculatePersonSummary(person, expenses);
    balances[person.id] = {
      name: person.name,
      balance: summary.balance
    };
  });

  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([id, data]) => {
    if (data.balance > 0.01) {
      creditors.push({ id: parseInt(id), ...data });
    } else if (data.balance < -0.01) {
      debtors.push({ id: parseInt(id), ...data, balance: -data.balance });
    }
  });

  const settlements = [];
  let i = 0, j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    
    const amount = Math.min(creditor.balance, debtor.balance);
    
    if (amount > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount * 100) / 100
      });
    }
    
    creditor.balance -= amount;
    debtor.balance -= amount;
    
    if (creditor.balance < 0.01) i++;
    if (debtor.balance < 0.01) j++;
  }

  return settlements;
};
