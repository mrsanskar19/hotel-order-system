'use client';

const Table = ({ children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        {children}
      </table>
    </div>
  );
};

const TableHead = ({ children }) => {
  return <thead className="bg-gray-100">{children}</thead>;
};

const TableBody = ({ children }) => {
  return <tbody className="divide-y divide-gray-200">{children}</tbody>;
};

const TableRow = ({ children }) => {
  return <tr>{children}</tr>;
};

const TableCell = ({ children, as = 'td' }) => {
  const Component = as;
  return <Component className="px-6 py-4 whitespace-nowrap">{children}</Component>;
};

export { Table, TableHead, TableBody, TableRow, TableCell };
