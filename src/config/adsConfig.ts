export interface AdUnitConfig {
  id: string;
  name: string;
  format?: string;
  slotId?: string;
  customCode?: string;
}

export const ADS_CONFIG = {
  enabled: true,
  showPlaceholdersWhenEmpty: false,
  adsenseClientId: '',
  universalAdCode: `<script async="async" data-cfasync="false" src="https://professionalsusceptible.com/1cd889dea3c4462595169e7f5655753/invoke.js"></script>
<div id="container-1cd889dea3c4462595169e7f5655753"></div>`,
  // Yeh property missing thi jiski wajah se length property ka error aa raha tha:
  homeGridAds: [
    { id: 'ad-1', name: 'Native Banner 1' },
    { id: 'ad-2', name: 'Native Banner 2' },
  ] as AdUnitConfig[],
};

// Build error resolve karne ke liye helper export
export const initAdSenseScript = () => {
  // Safe helper function
};
