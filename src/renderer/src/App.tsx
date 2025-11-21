import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="bg-blue-500 text-blue p-4">
      <h1 className="text-2xl font-bold">Chat YA</h1>
      <p className="mt-4">Tailwind CSS está funcionando!</p>
    </div>
  )
}

export default App
