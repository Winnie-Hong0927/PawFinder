import { NextRequest, NextResponse } from "next/server";

// Mock pets database
const pets: Record<string, any> = {
  "1": {
    id: "1",
    name: "小橘",
    species: "cat",
    breed: "中华田园猫",
    gender: "female",
    age: "1岁",
    weight: 3.5,
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dcf?w=800",
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800",
    ],
    description: "性格温顺亲人，喜欢撒娇，已绝育。毛色橘黄，非常可爱。",
    traits: ["温顺", "亲人", "安静"],
    healthStatus: "已绝育、已驱虫、已打疫苗",
    status: "available",
    shelterName: "阳光宠物救助站",
    shelterAddress: "北京市朝阳区爱心路88号",
    rescueDate: "2024-01-15",
  },
  "2": {
    id: "2",
    name: "旺财",
    species: "dog",
    breed: "金毛",
    gender: "male",
    age: "2岁",
    weight: 25.0,
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
    ],
    description: "活泼好动，喜欢户外运动，对人友好。非常聪明，已学会基本指令。",
    traits: ["活泼", "友好", "聪明"],
    healthStatus: "已绝育、已驱虫、已打疫苗",
    status: "available",
    shelterName: "爱心宠物之家",
    shelterAddress: "上海市浦东区幸福路66号",
    rescueDate: "2024-02-01",
  },
  "3": {
    id: "3",
    name: "咪咪",
    species: "cat",
    breed: "英短",
    gender: "male",
    age: "3岁",
    weight: 4.2,
    images: [
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800",
    ],
    description: "安静乖巧，适合公寓饲养。不太粘人但会在你身边静静陪伴。",
    traits: ["安静", "乖巧", "独立"],
    healthStatus: "已驱虫、已打疫苗（未绝育）",
    status: "available",
    shelterName: "阳光宠物救助站",
    shelterAddress: "北京市朝阳区爱心路88号",
    rescueDate: "2024-01-20",
  },
  "4": {
    id: "4",
    name: "豆豆",
    species: "dog",
    breed: "柴犬",
    gender: "female",
    age: "1.5岁",
    weight: 10.0,
    images: [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
    ],
    description: "忠诚护主，笑起来特别治愈。会用微笑迎接你回家！",
    traits: ["忠诚", "活泼", "爱笑"],
    healthStatus: "已绝育、已驱虫、已打疫苗",
    status: "pending",
    shelterName: "流浪动物救助中心",
    shelterAddress: "广州市天河区公益路123号",
    rescueDate: "2024-02-10",
  },
  "5": {
    id: "5",
    name: "小白",
    species: "cat",
    breed: "波斯猫",
    gender: "female",
    age: "4岁",
    weight: 3.8,
    images: [
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800",
    ],
    description: "优雅安静，需要定期毛发护理。喜欢在阳光下打盹。",
    traits: ["安静", "优雅", "粘人"],
    healthStatus: "已驱虫、已打疫苗",
    status: "available",
    shelterName: "爱心宠物之家",
    shelterAddress: "上海市浦东区幸福路66号",
    rescueDate: "2024-01-25",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const pet = pets[id];
  
  if (!pet) {
    return NextResponse.json({
      success: false,
      error: "宠物不存在",
    });
  }

  return NextResponse.json({
    success: true,
    pet,
  });
}
