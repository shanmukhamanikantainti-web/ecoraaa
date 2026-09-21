import React, { useState, useEffect } from 'react';
import {
  Home, Folder, Terminal, Smartphone, ClipboardList, Bot, Settings, HelpCircle,
  Search, Bell, RefreshCw, Monitor, Plus, Download, Upload
} from 'lucide-react';

type Tab = 'dashboard' | 'files' | 'console' | 'screen' | 'cases' | 'ai' | 'settings' | 'help';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isConnected, setIsConnected] = useState(true);
  const [workspace, setWorkspace] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Interactive console state
  const [commandInput, setCommandInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'PEGASUS Console v1.0.0',
    'Type \'help\' for available commands.',
    '',
    'pegasus@device:~$ adb devices',
    'List of devices attached',
    'PEGASUS-001      device',
    '',
    'pegasus@device:~$ pegasus status',
    'Device         : Online',
    'USB            : Mounted',
    'AI             : Ready',
    'Mirror         : Ready',
    'Storage        : 142.0 / 256 GB',
    'Battery        : 82%',
    'Uptime         : 2 days, 14 hours',
    'pegasus@device:~$'
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRunCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    let response = '';

    if (cmd === 'help') {
      response = 'Available commands: adb devices, pegasus status, logcat, dumpsys battery, clear';
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setCommandInput('');
      return;
    } else if (cmd === 'adb devices') {
      response = 'List of devices attached\n97d8db3d        device';
    } else {
      response = `Executed: ${cmd}\nCommand completed successfully.`;
    }

    setTerminalLogs(prev => [...prev, `pegasus@device:~$ ${cmd}`, response, 'pegasus@device:~$']);
    setCommandInput('');
  };

  return (
    <div className="pegasus-shell">
      {/* ── Left Navigation Sidebar ────────────────────────────── */}
      <aside className="pegasus-sidebar">
        <div>
          <div className="brand-section">
            <div className="brand-logo-icon">P</div>
            <div>
              <div className="brand-name">PEGASUS</div>
              <div className="brand-sub">Connect</div>
            </div>
          </div>

          <div className="nav-group">
            <div className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <Home className="nav-icon" size={16} />
              <span>Dashboard</span>
            </div>
            <div className={`nav-link ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>
              <Folder className="nav-icon" size={16} />
              <span>Files</span>
            </div>
            <div className={`nav-link ${activeTab === 'console' ? 'active' : ''}`} onClick={() => setActiveTab('console')}>
              <Terminal className="nav-icon" size={16} />
              <span>Console</span>
            </div>
            <div className={`nav-link ${activeTab === 'screen' ? 'active' : ''}`} onClick={() => setActiveTab('screen')}>
              <Smartphone className="nav-icon" size={16} />
              <span>Screen Mirror</span>
            </div>
            <div className={`nav-link ${activeTab === 'cases' ? 'active' : ''}`} onClick={() => setActiveTab('cases')}>
              <ClipboardList className="nav-icon" size={16} />
              <span>Cases</span>
            </div>
            <div className={`nav-link ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
              <Bot className="nav-icon" size={16} />
              <span>AI & Memory</span>
            </div>
          </div>

          <div className="nav-divider-label">System</div>
          <div className="nav-group">
            <div className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <Settings className="nav-icon" size={16} />
              <span>Settings</span>
            </div>
            <div className={`nav-link ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}>
              <HelpCircle className="nav-icon" size={16} />
              <span>Help</span>
            </div>
          </div>
        </div>

        {/* Connected Device Sidebar Widget */}
        <div className="sidebar-device-box">
          <div className="device-thumb-img">📱</div>
          <div>
            <div className="device-name-text">PEGASUS Phone</div>
            <div className="device-status-indicator">
              <span className="dot"></span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="device-meta-sub">Android 14 • ARM64</div>
          </div>
        </div>
      </aside>

      {/* ── Main Viewport Wrapper ────────────────────────────── */}
      <div className="main-viewport">
        {/* Top Navigation Bar */}
        <header className="header-topbar">
          <div className="global-search-container">
            <Search size={14} color="#9FA0B5" />
            <input type="text" placeholder="Search anything... (Ctrl + K)" />
            <span className="key-badge">Ctrl+K</span>
          </div>

          <div className="header-actions-right">
            <div className="workspace-switcher">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  className={`ws-pill-btn ${workspace === num ? 'active' : ''}`}
                  onClick={() => setWorkspace(num)}
                >
                  {num}
                </button>
              ))}
            </div>

            <button className="header-icon-button"><Bell size={15} /></button>
            <button className="header-icon-button" onClick={() => setActiveTab('settings')}><Settings size={15} /></button>
            <div className="user-avatar-circle">P</div>

            <div style={{ display: 'flex', gap: '6px', marginLeft: '6px' }}>
              <button style={{ border: 'none', background: 'transparent', color: '#9FA0B5', cursor: 'pointer' }}>—</button>
              <button style={{ border: 'none', background: 'transparent', color: '#9FA0B5', cursor: 'pointer' }}>▢</button>
              <button style={{ border: 'none', background: 'transparent', color: '#9FA0B5', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="page-container">
          {/* TAB 1: DEVICE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Device Dashboard</h1>
                  <p className="page-subtitle">Monitor and manage your PEGASUS device in real time.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                    ● {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                  <button className="btn-secondary" onClick={() => setIsConnected(!isConnected)}>
                    {isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                  <button className="btn-primary" onClick={() => setIsConnected(true)}>Reconnect</button>
                </div>
              </div>

              {/* Main Device Overview Panel */}
              <div className="panel-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '64px', height: '110px', background: '#0F172A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '28px' }}>📱</div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800 }}>PEGASUS Phone</h2>
                    <div style={{ fontSize: '12px', color: '#555663', marginTop: '2px' }}>Android 14 • PEGASUS OS v1.0.0</div>
                    <div style={{ fontSize: '11px', color: '#9FA0B5', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>SN: PG-2024-00127</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      <span style={{ fontSize: '10px', background: '#EDEFF3', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>ARM64</span>
                      <span style={{ fontSize: '10px', background: '#EDEFF3', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>8 GB RAM</span>
                      <span style={{ fontSize: '10px', background: '#EDEFF3', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>256 GB</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', color: '#2F7EDA' }}>🔌</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px' }}>USB</div>
                    <div style={{ fontSize: '10px', color: '#28A745', fontWeight: 600 }}>Connected</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', color: '#2F7EDA' }}>📶</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px' }}>Wi-Fi</div>
                    <div style={{ fontSize: '10px', color: '#28A745', fontWeight: 600 }}>Connected</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', color: '#2F7EDA' }}>📱</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px' }}>ADB</div>
                    <div style={{ fontSize: '10px', color: '#28A745', fontWeight: 600 }}>Authenticated</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', color: '#2F7EDA' }}>🖥️</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px' }}>Session</div>
                    <div style={{ fontSize: '10px', color: '#28A745', fontWeight: 600 }}>Active</div>
                  </div>
                </div>

                <div style={{ borderLeft: '1px solid #C6D1D7', paddingLeft: '24px', width: '220px' }}>
                  <div style={{ fontSize: '11px', color: '#555663', fontWeight: 600 }}>Battery</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#1A1C23', margin: '2px 0' }}>82%</div>
                  <div style={{ height: '6px', background: '#EDEFF3', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '82%', height: '100%', background: '#2F7EDA' }}></div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#555663', fontWeight: 600, marginTop: '10px' }}>Storage</div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>142.0 / 256 GB</div>
                </div>
              </div>

              {/* Telemetry & Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px' }}>
                <div className="panel-card">
                  <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>System Telemetry</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    <div style={{ background: '#EDEFF3', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#555663', fontWeight: 700 }}>CPU</div>
                      <div style={{ fontSize: '20px', fontWeight: 800 }}>24%</div>
                      <div style={{ fontSize: '10px', color: '#9FA0B5' }}>2.6 GHz • 8 Cores</div>
                    </div>
                    <div style={{ background: '#EDEFF3', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#555663', fontWeight: 700 }}>MEMORY</div>
                      <div style={{ fontSize: '20px', fontWeight: 800 }}>3.6 / 8 GB</div>
                      <div style={{ fontSize: '10px', color: '#9FA0B5' }}>45% Utilized</div>
                    </div>
                    <div style={{ background: '#EDEFF3', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#555663', fontWeight: 700 }}>NETWORK</div>
                      <div style={{ fontSize: '20px', fontWeight: 800 }}>12.4 Mbps</div>
                      <div style={{ fontSize: '10px', color: '#9FA0B5' }}>↑ 3.2 Mbps</div>
                    </div>
                    <div style={{ background: '#EDEFF3', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#555663', fontWeight: 700 }}>TEMP</div>
                      <div style={{ fontSize: '20px', fontWeight: 800 }}>36°C</div>
                      <div style={{ fontSize: '10px', color: '#28A745' }}>Normal</div>
                    </div>
                  </div>
                </div>

                <div className="panel-card">
                  <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Quick Actions</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => setActiveTab('screen')}>Open Mirror</button>
                    <button className="btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setActiveTab('console')}>Inspect ADB</button>
                    <button className="btn-secondary" style={{ justifyContent: 'center' }}>Security Scan</button>
                    <button className="btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setActiveTab('files')}>Open Files</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: FILES & STORAGE */}
          {activeTab === 'files' && (
            <>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Files & Storage</h1>
                  <p className="page-subtitle">Browse and manage files on your PEGASUS device.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-primary"><Upload size={14} /> Upload</button>
                  <button className="btn-secondary"><Download size={14} /> Download</button>
                  <button className="btn-secondary"><RefreshCw size={14} /> Sync</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 240px', gap: '18px' }}>
                <div className="panel-card" style={{ padding: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#9FA0B5', textTransform: 'uppercase', marginBottom: '8px' }}>PEGASUS Device</div>
                  <div className="nav-group">
                    <div className="nav-link active"><Folder size={14} /> Projects</div>
                    <div className="nav-link"><Folder size={14} /> Documents</div>
                    <div className="nav-link"><Folder size={14} /> Downloads</div>
                    <div className="nav-link"><Folder size={14} /> DCIM</div>
                  </div>
                </div>

                <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
                  <table className="pegasus-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Modified</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>📁 app</td><td>--</td><td>May 10, 2024</td><td>Folder</td></tr>
                      <tr><td>📁 build</td><td>--</td><td>May 10, 2024</td><td>Folder</td></tr>
                      <tr style={{ background: '#EBF3FC' }}><td>📁 src</td><td>--</td><td>May 10, 2024</td><td>Folder</td></tr>
                      <tr><td>📄 .gitignore</td><td>1.2 KB</td><td>May 10, 2024</td><td>Text File</td></tr>
                      <tr><td>📄 README.md</td><td>4.8 KB</td><td>May 08, 2024</td><td>Markdown</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="panel-card">
                  <h3 style={{ fontSize: '14px', fontWeight: 700 }}>src</h3>
                  <div style={{ fontSize: '11px', color: '#555663', marginTop: '2px' }}>File Folder</div>
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
                    <div><strong>Location:</strong> /sdcard/Projects/PEGASUS</div>
                    <div><strong>Items:</strong> 24 items</div>
                    <div><strong>Created:</strong> Apr 28, 2024</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: CONSOLE SHELL */}
          {activeTab === 'console' && (
            <>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Console Shell</h1>
                  <p className="page-subtitle">Run commands, view logs and monitor system events.</p>
                </div>
                <button className="btn-secondary" onClick={() => setTerminalLogs([])}>Clear Console</button>
              </div>

              <div className="console-terminal-view">
                {terminalLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>

              <form onSubmit={handleRunCommand} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Type command... (e.g. adb devices, pegasus status)"
                  style={{ flex: 1, padding: '9px 12px', borderRadius: '6px', border: '1px solid #C6D1D7', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                />
                <button type="submit" className="btn-primary">Run</button>
              </form>
            </>
          )}

          {/* TAB 4: SCREEN MIRROR */}
          {activeTab === 'screen' && (
            <>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Screen Mirror</h1>
                  <p className="page-subtitle">View and control your PEGASUS device in real time.</p>
                </div>
                <span className="status-badge connected">● Live 60 FPS</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '18px' }}>
                <div className="panel-card" style={{ background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
                  <div style={{ width: '600px', height: '340px', borderRadius: '20px', border: '4px solid #334155', background: '#1E293B', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: 800 }}>10:24</div>
                    <div style={{ fontSize: '12px', color: '#9FA0B5' }}>Mon, May 10</div>
                  </div>
                </div>

                <div className="panel-card">
                  <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Mirror Controls</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    <button className="btn-secondary" style={{ justifyContent: 'center' }}>Fullscreen</button>
                    <button className="btn-secondary" style={{ justifyContent: 'center' }}>Screenshot</button>
                    <button className="btn-primary" style={{ justifyContent: 'center', gridColumn: 'span 2' }}>Remote Control</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 5: CASES & WORKSPACES */}
          {activeTab === 'cases' && (
            <>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Cases & Workspaces</h1>
                  <p className="page-subtitle">Record, manage and analyse development sessions.</p>
                </div>
                <button className="btn-primary"><Plus size={14} /> New Case</button>
              </div>

              <div className="panel-card">
                <table className="pegasus-table">
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>CASE-00127</td><td>Build Failure Investigation</td><td><span style={{ color: '#28A745', fontWeight: 700 }}>Active</span></td><td>May 10, 2024</td><td>14:32:18</td></tr>
                    <tr><td>CASE-00126</td><td>Authentication Issue</td><td><span style={{ color: '#555663' }}>Completed</span></td><td>May 09, 2024</td><td>08:14</td></tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TAB 6: AI & MEMORY HUB */}
          {activeTab === 'ai' && (
            <>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">AI & Memory Hub</h1>
                  <p className="page-subtitle">Your intelligent development companion.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 260px', gap: '18px' }}>
                <div className="panel-card">
                  <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>AI Agents</h3>
                  <div style={{ background: '#EBF3FC', padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                    ⚙️ Orchestrator <span style={{ color: '#28A745', float: 'right' }}>Active</span>
                  </div>
                </div>

                <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '400px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, borderBottom: '1px solid #C6D1D7', paddingBottom: '8px' }}>PEGASUS AI Assistant</div>
                  <div style={{ flex: 1, padding: '12px 0', fontSize: '12px', color: '#1A1C23' }}>
                    Hello! I'm PEGASUS, your AI development companion.
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" placeholder="Ask PEGASUS..." style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #C6D1D7', outline: 'none' }} />
                    <button className="btn-primary">Send</button>
                  </div>
                </div>

                <div className="panel-card">
                  <h3 style={{ fontSize: '13px', fontWeight: 700 }}>Current Context</h3>
                  <div style={{ fontSize: '11px', color: '#555663', marginTop: '4px' }}>12 files indexed</div>
                </div>
              </div>
            </>
          )}

          {/* TAB 7: SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Settings</h1>
                  <p className="page-subtitle">Customize PEGASUS Connect to fit your workflow.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '18px' }}>
                <div className="panel-card" style={{ padding: '10px' }}>
                  <div className="nav-group">
                    <div className="nav-link active"><Settings size={14} /> General</div>
                    <div className="nav-link"><Smartphone size={14} /> Device Connection</div>
                    <div className="nav-link"><Monitor size={14} /> Appearance</div>
                  </div>
                </div>

                <div className="panel-card">
                  <h3 style={{ fontSize: '15px', fontWeight: 700 }}>General Settings</h3>
                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" defaultChecked /> Start PEGASUS Connect at system login
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 8: HELP & SUPPORT PAGE */}
          {activeTab === 'help' && (
            <>
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Help & Support</h1>
                  <p className="page-subtitle">Find answers, learn how to use PEGASUS Connect, or contact support.</p>
                </div>
              </div>

              <div className="panel-card" style={{ background: '#EBF3FC', border: '1px solid #B2D1F5', padding: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#2F7EDA' }}>Find answers. Solve faster.</h2>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', maxWidth: '480px' }}>
                  <input type="text" placeholder="Search help articles..." style={{ flex: 1, padding: '9px 12px', borderRadius: '6px', border: '1px solid #C6D1D7', outline: 'none' }} />
                  <button className="btn-primary">Search</button>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer Taskbar */}
        <footer className="footer-taskbar">
          <div className="footer-nav-links">
            <button className={`footer-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>🏠 Dashboard</button>
            <button className={`footer-nav-item ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>📁 Files</button>
            <button className={`footer-nav-item ${activeTab === 'console' ? 'active' : ''}`} onClick={() => setActiveTab('console')}>🖥️ Console</button>
            <button className={`footer-nav-item ${activeTab === 'screen' ? 'active' : ''}`} onClick={() => setActiveTab('screen')}>📱 Mirror</button>
            <button className={`footer-nav-item ${activeTab === 'cases' ? 'active' : ''}`} onClick={() => setActiveTab('cases')}>📋 Cases</button>
            <button className={`footer-nav-item ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>👤 AI</button>
          </div>

          <div className="footer-metrics-right">
            <span>Workspace {workspace}</span>
            <span>CPU 24%</span>
            <span>RAM 45%</span>
            <span>📶</span>
            <span>🔋 82%</span>
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
