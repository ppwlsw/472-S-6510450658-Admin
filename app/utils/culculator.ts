interface ShopGraphProps {
  name: string;
  count: number;
}

interface ShopBarGraphProps {
  name: string;
  confirm: number;
  ban: number;
  pending: number;
}

function calculateNewShopInSevenDays(shops: Shop[]): ShopGraphProps[] {
  const newShops = [...shops];
  const today = new Date(); // Today's date
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 6); // Get date from 6 days ago (to include today = 7 days total)

  const newShop = newShops.filter((shop) =>
    new Date(shop.created_at) >= oneWeekAgo &&
    new Date(shop.created_at) <= today
  );

  // กำหนดวันให้ถูกต้องตามมาตรฐาน JavaScript (0 = วันอาทิตย์, 1 = วันจันทร์, ..., 6 = วันเสาร์)
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // สร้าง array เพื่อเก็บข้อมูล 7 วันย้อนหลัง โดยเริ่มจากวันเสาร์ (วันก่อนวันนี้) ย้อนไป
  let data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // ดึงชื่อวันจาก dayNames array โดยใช้ getDay()
    const dayName = dayNames[date.getDay()];

    const count = newShop.filter((shop) => {
      const shopDate = new Date(shop.created_at);
      return shopDate.getDate() === date.getDate() &&
        shopDate.getMonth() === date.getMonth() &&
        shopDate.getFullYear() === date.getFullYear();
    }).length;

    data.push({ name: dayName, count: count });
  }

  // Abbreviate day names
  const mapData = data.map((day) => {
    return { name: day.name.slice(0, 3), count: day.count };
  });

  return mapData;
}

function calculateStatusShopInSevenDays(shops: Shop[]): ShopBarGraphProps[] {
  const newShops = [...shops];
  const today = new Date(); // Today's date
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 6); // Get date from 6 days ago (to include today = 7 days total)

  const newShop = newShops.filter((shop) =>
    new Date(shop.created_at) >= oneWeekAgo &&
    new Date(shop.created_at) <= today
  );

  // กำหนดวันให้ถูกต้องตามมาตรฐาน JavaScript (0 = วันอาทิตย์, 1 = วันจันทร์, ..., 6 = วันเสาร์)
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // สร้าง array เพื่อเก็บข้อมูล 7 วันย้อนหลัง โดยเริ่มจากวันเสาร์ (วันก่อนวันนี้) ย้อนไป
  let data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // ดึงชื่อวันจาก dayNames array โดยใช้ getDay()
    const dayName = dayNames[date.getDay()];

    const confirm = newShop.filter((shop) => {
      const shopDate = new Date(shop.created_at);
      return shop.is_verified === true && shop.deleted_at == null
        && shopDate.getDate() === date.getDate() &&
        shopDate.getMonth() === date.getMonth() &&
        shopDate.getFullYear() === date.getFullYear();
    }).length;

    const ban = newShop.filter((shop) => {
      const shopDate = new Date(shop.created_at);
      return shop.is_verified === true && shop.deleted_at != null
        && shopDate.getDate() === date.getDate() &&
        shopDate.getMonth() === date.getMonth() &&
        shopDate.getFullYear() === date.getFullYear();
    }).length;

    const pending = newShop.filter((shop) => {
      const shopDate = new Date(shop.created_at);
      return shop.is_verified === false
        && shopDate.getDate() === date.getDate() &&
        shopDate.getMonth() === date.getMonth() &&
        shopDate.getFullYear() === date.getFullYear();
    }).length;

    data.push({ name: dayName, confirm: confirm, ban: ban, pending: pending });
  }

  // Abbreviate day names
  const mapData = data.map((day) => {
    return { name: day.name.slice(0, 3), confirm: day.confirm, ban: day.ban, pending: day.pending };
  });
  console.log(mapData);

  return mapData;

}

export { calculateNewShopInSevenDays, calculateStatusShopInSevenDays };