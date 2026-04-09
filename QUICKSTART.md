# Kimi CLI Hierarchical MCP Agents - Quick Start Guide

## 🚀 เริ่มต้นใช้งานใน 5 นาที

### ขั้นตอนที่ 1: ติดตั้ง Dependencies

```bash
# Clone หรือสร้างโปรเจค
mkdir -p ~/kimi-mcp-agents
cd ~/kimi-mcp-agents

# ติดตั้ง dependencies
npm install
```

### ขั้นตอนที่ 2: ตั้งค่า Environment

```bash
# คัดลอกไฟล์ตัวอย่าง
cp .env.example .env

# แก้ไขไฟล์ .env ด้วย API key ของคุณ
# KIMI_API_KEY=your_actual_api_key_here
```

### ขั้นตอนที่ 3: เริ่มต้นระบบ

```bash
# ตรวจสอบการตั้งค่า
npm start

# เริ่ม Orchestrator Server
npm run start:orchestrator
```

### ขั้นตอนที่ 4: ใช้งานกับ Kimi CLI

```bash
# ตั้งค่า Kimi CLI
kimi config set mcp.enabled true
kimi config set mcp.configPath ~/kimi-mcp-agents/cline_mcp_settings.json

# ทดสอบ
kimi ask "Plan a new feature for user authentication"
```

---

## 📋 คำสั่งที่ใช้บ่อย

### เริ่ม Servers

```bash
# เริ่มแต่ละ server แยกกัน
npm run start:orchestrator  # Port 3000
npm run start:planner       # Port 3001
npm run start:coder         # Port 3002
npm run start:researcher    # Port 3003

# เริ่มทั้งหมดพร้อมกัน
npm run start:all
```

### ตรวจสอบสถานะ

```bash
# ดู logs
tail -f logs/orchestrator-server.log
tail -f logs/planner-server.log

# ตรวจสอบ process
ps aux | grep mcp-server
```

### การทดสอบ

```bash
# รัน tests
npm test

# รัน tests แบบ watch
npm run test:watch
```

---

## 🔧 การตั้งค่าเพิ่มเติม

### ปรับแต่ง Task Routing

แก้ไขไฟล์ `cline_mcp_settings.json`:

```json
{
  "hierarchicalConfig": {
    "taskRouting": {
      "routingRules": [
        {
          "pattern": "your-pattern-here",
          "targetAgent": "target-agent-name"
        }
      ]
    }
  }
}
```

### ปรับแต่ง Agent Capabilities

แก้ไขไฟล์ใน `config/agents/*.json`:

```json
{
  "capabilities": {
    "yourCapability": {
      "enabled": true,
      "settings": {}
    }
  }
}
```

---

## 💡 ตัวอย่างการใช้งาน

### ตัวอย่างที่ 1: สร้างโค้ด

```javascript
// ใช้ผ่าน MCP Client
const result = await client.callTool('coder', 'generate_code', {
  requirements: 'Create a function to validate email addresses',
  language: 'javascript'
});
```

### ตัวอย่างที่ 2: วางแผนโครงการ

```javascript
const result = await client.callTool('planner', 'create_plan', {
  objective: 'Build a REST API for user management',
  deadline: '2024-03-01'
});
```

### ตัวอย่างที่ 3: ค้นหาข้อมูล

```javascript
const result = await client.callTool('researcher', 'search_web', {
  query: 'best practices for API authentication',
  maxResults: 5
});
```

---

## 🐛 การแก้ไขปัญหาเบื้องต้น

### ปัญหา: Server ไม่ start

```bash
# ตรวจสอบ port ถูกใช้งานหรือไม่
lsof -i :3000

# หยุด process ที่ใช้ port
kill -9 $(lsof -t -i:3000)
```

### ปัญหา: API Key ไม่ถูกต้อง

```bash
# ตรวจสอบ environment variable
echo $KIMI_API_KEY

# ตั้งค่าใหม่
export KIMI_API_KEY=your_api_key
```

### ปัญหา: Dependencies ขาดหาย

```bash
# ล้าง cache และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 เอกสารเพิ่มเติม

- [Integration Guide](./kimi-cli-hierarchical-mcp-integration-guide.md) - คู่มือฉบับเต็ม
- [Configuration Reference](./config/) - ไฟล์การตั้งค่าทั้งหมด
- [API Documentation](./docs/api.md) - เอกสาร API

---

## 🤝 การมีส่วนร่วม

หากต้องการมีส่วนร่วมในโปรเจค:

1. Fork โปรเจค
2. สร้าง branch ใหม่
3. Commit การเปลี่ยนแปลง
4. ส่ง Pull Request

---

## 📄 License

MIT License - ดูรายละเอียดในไฟล์ LICENSE
