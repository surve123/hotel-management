import api from './api';

export const reportService = {
  // Source ROI report
  getSourceReport: async () => {
    const response = await api.get('/reports/sources');
    return response.data.data;
  },

  // Telecaller performance leaderboard
  getTelecallerReport: async () => {
    const response = await api.get('/reports/telecallers');
    return response.data.data;
  },

  // Revenue & Conversion report
  getRevenueReport: async () => {
    const response = await api.get('/reports/revenue');
    return response.data.data;
  },

  // Download leads Excel
  downloadLeadsExcel: async () => {
    const response = await api.get('/reports/export/leads', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Leads_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Download finance Excel
  downloadFinanceExcel: async () => {
    const response = await api.get('/reports/export/finance', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Finance_Ledger_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Trigger daily email backup
  triggerDailyEmail: async () => {
    const response = await api.post('/reports/trigger-daily-email');
    return response.data.data;
  },
};

export default reportService;
