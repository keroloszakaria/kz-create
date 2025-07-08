import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { httpRequest } from "@/services/api.js";

export const useStatisticsStore = defineStore("statistics", () => {
  const cards = reactive({});
  const charts = reactive({});
  const tables = reactive({});
  const getReportsData = async (params) => {
    try {
      const response = await httpRequest("report", { params });
      const {
        cards: cardsData,
        charts: chartsData,
        tables: tablesData,
      } = response.data.report;
      Object.assign(cards, cardsData);
      Object.assign(charts, chartsData);
      Object.assign(tables, tablesData);
      return response.data.report;
    } catch (error) {
      throw error;
    }
  };

  return {
    cards,
    charts,
    tables,
    getReportsData,
  };
});
