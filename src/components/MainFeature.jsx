import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isThisMonth, isThisYear } from 'date-fns';
import Chart from 'react-apexcharts';
import ApperIcon from './ApperIcon';

function MainFeature() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deals, setDeals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    seller: '',
    category: '',
    tags: '',
    notes: ''
  });

  const platforms = [
    'AppSumo', 'Prime Club', 'StackSocial', 'PitchGround', 
    'SaaS Mantra', 'Earlybird', 'RocketHub'
  ];

  const categories = [
    'Productivity', 'Marketing', 'Design', 'Development', 
    'Analytics', 'Business', 'Content', 'Education'
  ];

  // Sample data for demonstration
  useEffect(() => {
    const sampleDeals = [
      {
        id: '1',
        name: 'ClickFunnels Alternative',
        amount: 59,
        purchaseDate: '2024-01-15',
        seller: 'AppSumo',
        category: 'Marketing',
        tags: ['funnel', 'landing-page'],
        notes: 'Great for building sales funnels'
      },
      {
        id: '2',
        name: 'Design Tool Pro',
        amount: 39,
        purchaseDate: '2024-02-20',
        seller: 'Prime Club',
        category: 'Design',
        tags: ['graphics', 'templates'],
        notes: 'Unlimited templates included'
      },
      {
        id: '3',
        name: 'Analytics Dashboard',
        amount: 89,
        purchaseDate: '2024-03-10',
        seller: 'StackSocial',
        category: 'Analytics',
        tags: ['data', 'reporting'],
        notes: 'Real-time data visualization'
      }
    ];
    setDeals(sampleDeals);
  }, []);

  const handleAddDeal = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.seller || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newDeal = {
      id: Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setDeals([...deals, newDeal]);
    setFormData({
      name: '',
      amount: '',
      purchaseDate: format(new Date(), 'yyyy-MM-dd'),
      seller: '',
      category: '',
      tags: '',
      notes: ''
    });
    setShowAddForm(false);
    toast.success('Deal added successfully!');
  };

  const deleteDeal = (id) => {
    setDeals(deals.filter(deal => deal.id !== id));
    toast.success('Deal deleted successfully!');
  };

  // Calculate metrics
  const totalSpent = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const monthlySpending = deals
    .filter(deal => isThisMonth(new Date(deal.purchaseDate)))
    .reduce((sum, deal) => sum + deal.amount, 0);
  const averageDealValue = deals.length > 0 ? totalSpent / deals.length : 0;
  const topCategory = [...new Set(deals.map(deal => deal.category))]
    .map(cat => ({
      category: cat,
      count: deals.filter(deal => deal.category === cat).length
    }))
    .sort((a, b) => b.count - a.count)[0]?.category || 'None';

  // Chart data
  const chartOptions = {
    chart: { 
      type: 'donut',
      toolbar: { show: false }
    },
    colors: ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'],
    legend: { position: 'bottom' },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' }
      }
    }]
  };

  const categoryData = [...new Set(deals.map(deal => deal.category))]
    .map(cat => deals.filter(deal => deal.category === cat).reduce((sum, deal) => sum + deal.amount, 0));
  
  const categoryLabels = [...new Set(deals.map(deal => deal.category))];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'categories', label: 'Categories', icon: 'Folder' },
    { id: 'calendar', label: 'Calendar', icon: 'Calendar' }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Navigation Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
      >
        <nav className="flex space-x-1 bg-white/60 dark:bg-surface-800/60 backdrop-blur-md rounded-2xl p-1 shadow-soft">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-soft'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">{tab.label}</span>
            </button>
          ))}
        </nav>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-accent to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
        >
          <ApperIcon name="Plus" className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Add LTD</span>
        </motion.button>
      </motion.div>

      {/* Dashboard Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6 md:space-y-8"
          >
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: 'DollarSign', color: 'from-red-400 to-red-600' },
                { label: 'This Month', value: `$${monthlySpending.toFixed(2)}`, icon: 'TrendingUp', color: 'from-blue-400 to-blue-600' },
                { label: 'Avg Deal Value', value: `$${averageDealValue.toFixed(2)}`, icon: 'Target', color: 'from-green-400 to-green-600' },
                { label: 'Total Deals', value: deals.length, icon: 'Package', color: 'from-purple-400 to-purple-600' }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="metric-card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">{metric.label}</p>
                      <p className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-200">{metric.value}</p>
                    </div>
                    <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-soft`}>
                      <ApperIcon name={metric.icon} className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Spending by Category Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="metric-card"
              >
                <h3 className="text-lg md:text-xl font-semibold text-surface-800 dark:text-surface-200 mb-4 md:mb-6">
                  Spending by Category
                </h3>
                {categoryData.length > 0 ? (
                  <Chart
                    options={chartOptions}
                    series={categoryData}
                    type="donut"
                    height={250}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-surface-500 dark:text-surface-400">
                    <div className="text-center">
                      <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No data available</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Recent Deals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="metric-card"
              >
                <h3 className="text-lg md:text-xl font-semibold text-surface-800 dark:text-surface-200 mb-4 md:mb-6">
                  Recent Deals
                </h3>
                <div className="space-y-3 md:space-y-4 max-h-64 overflow-y-auto">
                  {deals.slice(-5).reverse().map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-3 md:p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-surface-800 dark:text-surface-200 truncate">{deal.name}</h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">{deal.seller} • {deal.category}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="font-semibold text-primary">${deal.amount}</span>
                        <button
                          onClick={() => deleteDeal(deal.id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {deals.length === 0 && (
                    <div className="text-center py-8 text-surface-500 dark:text-surface-400">
                      <ApperIcon name="Package" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No deals yet. Add your first LTD!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => {
                const categoryDeals = deals.filter(deal => deal.category === category);
                const categorySpent = categoryDeals.reduce((sum, deal) => sum + deal.amount, 0);
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="deal-card hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-surface-800 dark:text-surface-200">{category}</h3>
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon name="Folder" className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-400">Deals:</span>
                        <span className="font-medium">{categoryDeals.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-400">Spent:</span>
                        <span className="font-medium text-primary">${categorySpent.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="deal-card">
              <h3 className="text-lg md:text-xl font-semibold text-surface-800 dark:text-surface-200 mb-6">
                Purchase Timeline
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {deals
                  .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
                  .map((deal) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-4 p-4 bg-surface-50 dark:bg-surface-700 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-soft">
                        <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-surface-800 dark:text-surface-200 truncate">{deal.name}</h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                          {format(new Date(deal.purchaseDate), 'MMM dd, yyyy')} • {deal.seller}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">${deal.amount}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">{deal.category}</p>
                      </div>
                    </motion.div>
                  ))}
                {deals.length === 0 && (
                  <div className="text-center py-12 text-surface-500 dark:text-surface-400">
                    <ApperIcon name="Calendar" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No deals to display on timeline</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Deal Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text">Add New LTD</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                >
                  <ApperIcon name="X" className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddDeal} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Deal Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 neu-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      placeholder="e.g., ClickFunnels Alternative"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Amount ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-3 neu-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      placeholder="59.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="w-full px-4 py-3 neu-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Platform *
                    </label>
                    <select
                      value={formData.seller}
                      onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                      className="w-full px-4 py-3 neu-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      required
                    >
                      <option value="">Select Platform</option>
                      {platforms.map((platform) => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 neu-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 neu-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      placeholder="funnel, marketing, automation"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 neu-input rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                    placeholder="Additional notes about this deal..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-card transition-all duration-300 transform hover:scale-105"
                  >
                    Add Deal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;