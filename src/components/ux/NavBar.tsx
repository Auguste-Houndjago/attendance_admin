



import { Clock, Search, Monitor, Sun, Bell, User } from 'lucide-react';


export default function NavBar() {
  return (
    <header className="bg-black text-white p-4 flex items-center justify-between">
    <div className="flex items-center space-x-6">
      <span>Edit</span>
      <span>View</span>
      <span>Help</span>
    </div>
    
    <div className="text-center">
      <h1 className="text-sm font-medium">Team Management</h1>
    </div>
    
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-3 bg-white rounded-full"></div>
        <Clock className="w-4 h-4" />
        <Search className="w-4 h-4" />
        <Monitor className="w-4 h-4" />
      </div>
      <span className="text-xs">Wed Mar 20 10:28 AM</span>
    </div>
  </header>
  )
}


