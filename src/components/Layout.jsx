import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '220px', flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
