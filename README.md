# emotional_assistant_web_admin

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

1. 用户信息管理
   功能描述：管理用户基本信息，确保数据安全和隐私保护。
   实现方式：
   提供用户增删改查功能。
   设置用户权限，确保隐私安全。

2. 旅游管理功能
   功能描述：管理旅游景点推荐和云旅游图片，以及每个推荐所归的分类。
   实现方式：
   提供景点信息和图片的增删改查功能。
   管理用户上传的打卡照片。

   管理员在后台添加旅游景点信息和图片，上传时需填写分类

3. 音乐视频管理功能
   功能描述：管理音乐视频，以及每个推荐所归的分类。
   实现方式：
   提供音乐和视频资源的增删改查功能。

   管理员在后台上传或链接音乐和视频资源，上传时需填写分类

4. 心理知识宣传管理
   功能描述：管理心理知识文章和视频，提供科学、准确的心理健康知识。
   实现方式：
   提供心理知识内容的增删改查功能。

   管理员在后台上传或链接心理知识内容

5. 情绪调节训练功能管理
   功能描述：对场景以及问题、答案、分数的增删改查

6. 心情测评功能管理
   功能描述：对心情测评问卷以及评分规则的增删改查
7. 解压小游戏管理 7k7k 网页链接
   功能描述：管理小游戏的地址 图片 链接 标题 描述

```javascript
1. 用户管理 (src/views/users/index.vue)
// 用户列表
{
  id: Number,                // 用户ID
  username: String,              // 用户名                      
  email: String,             // 邮箱
  role: String,              // 角色（管理员/用户）
  avatar: String,            // 头像URL                     
  createTime: Number         // 创建时间戳
}
2. 个人资料 (src/views/profile/index.vue)
// 用户信息
{
  username: String,          // 用户名
  email: String,             // 邮箱
  avatar: String,            // 头像URL               
  roles: Array,              // 角色数组
  createTime: Number         // 创建时间戳
}
3. 登录 (src/views/login/index.vue)
// 登录表单
{
  username: String,          // 用户名
  password: String           // 密码
}
4. 情绪训练管理 (src/views/emotion-training/index.vue)
// 训练项目
{
  id: Number,                // 训练ID
  title: String,             // 训练标题
  description: String,       // 训练描述
  createTime: String,        // 创建时间
  questions: [               // 问题数组       
    {
      id: Number,            // 问题ID
      content: String,       // 问题内容
      order: Number,         // 问题顺序       
      options: [             // 选项数组       
        {
          id: Number,        // 选项ID
          content: String,   // 选项内容
          isCorrect: Boolean // 是否为正确选项
        }                    // 是否需要分值    score 不需要 直接引导
      ]
    }
  ]
}
5. 问卷管理 (src/views/questionnaires/index.vue)
// 问卷
{
  id: Number,                // 问卷ID
  title: String,             // 问卷标题
  description: String,       // 问卷描述
  createTime: String,        // 创建时间
  questions: [               // 问题数组
    {
      id: Number,            // 问题ID
      content: String,       // 问题内容
      options: [             // 选项数组
        {
          id: Number,        // 选项ID
          content: String,   // 选项内容
          score: Number      // 选项分数(1-5)
        }
      ]
    }
  ]
}
6. 旅游推荐管理 (src/views/tourism/recommendations.vue)
// 景点推荐
{
  id: Number,                // 景点ID
  title: String,             // 景点标题
  image: String,             // 景点图片URL                      
  details: String,           // 景点详情                            
  category: String,          // 情绪分类(positive/neutral/negative等) 
  createTime: Number         // 创建时间戳
}
7. 旅游打卡管理 (src/views/tourism/check-ins.vue)
// 打卡图片
{
  id: Number,                // 打卡ID
  image: String,             // 图片URL            
  category: String,          // 情绪分类      
  createTime: Number         // 创建时间戳
}
8. 音乐推荐管理 (src/views/media/music.vue)
// 音乐
{
  id: Number,                // 音乐ID
  title: String,             // 音乐标题
  artist: String,            // 艺术家         
  cover: String,             // 封面图URL       
  url: String,               // 音频URL         
  duration: Number,          // 时长(秒)       
  description: String        // 描述
  category: String,          // 情绪分类       
}
9. 视频推荐管理 (src/views/media/video.vue) 心理视频管理 统一管理视频
// 视频
{
  id: Number,                // 视频ID          
  title: String,             // 视频标题
  description: String,       // 视频描述
  cover: String,             // 封面图URL      
  url: String,               // 视频URL       
  category: String           // 情绪分类        
  createTime: String         // 创建时间 (格式化的字符串)
}
12. 心理视频管理 (src/views/psychology/videos.vue) 心理视频管理 
// 心理视频
{
  id: Number,                // 视频ID
  title: String,             // 视频标题
  description: String,       // 视频描述
  cover: String,             // 封面图片URL  
  url: String,               // 视频文件URL
  category: String,          // 情绪分类 
  createTime: String         // 创建时间 (格式化的字符串)
}
10. 游戏管理 (src/views/games/management.vue)
// 游戏
{
  id: Number,                // 游戏ID
  title: String,             // 游戏标题
  description: String,       // 游戏描述
  image: String,             // 游戏图片URL   
  url: String,               // 游戏链接     
  category: String,          // 情绪分类      
  createTime: String         // 创建时间
}
11. 心理文章管理 (src/views/psychology/articles.vue)
// 心理文章
{
  id: Number,                // 文章ID
  title: String,             // 文章标题
  description: String,       // 文章简要描述
  content: String,           // 文章详细内容
  category: String,          // 情绪分类 ('positive', 'negative', 'neutral' 等)
  createTime: String,        // 创建时间 (格式化的字符串)
  cover: String              // 封面图片URL  
}
12. 情绪日记 (src/diarie/entities/diarie.vue)
// 情绪日记
{
  id: Number,                // 日记ID
  content: String,           // 日记详细内容
  moods: String,          // 情绪分值
  createTime: String,        // 创建时间 (格式化的字符串)
}
// 情绪分值
{
  id: Number,                // 文章ID
  name: String,           // 文章详细内容
  score: Number,          // 情绪分值 
}

通用数据结构
情绪分类选项
{
  id: Number,                // 记录ID
  label: String,             // 情绪 中文
  value: String              // 情绪 value
}
[
  { label: '非常积极', value: 'very_positive' },
  { label: '积极', value: 'positive' },
  { label: '中立', value: 'neutral' },
  { label: '消极', value: 'negative' },
  { label: '非常消极', value: 'very_negative' }
]
// 11. 情感分析记录 (src/views/emotions/records.vue)
// 情感记录
// {
//   id: Number,                // 记录ID
//   userId: String,            // 用户ID
//   content: String,           // 内容
//   emotion: String,           // 情感类型(积极/消极/中性)
//   score: Number,             // 情感分数
//   date: String               // 分析时间
// }
// 12. 情感统计 (src/views/emotions/statistics.vue)
// 统计数据
// {
//   total: Number,             // 总记录数
//   positive: Number,          // 积极记录数
//   negative: Number,          // 消极记录数
//   neutral: Number,           // 中性记录数
//   avgScore: Number           // 平均分数
// }
// 文件上传配置
// {
//   action: String,            // 上传地址
//   headers: Object,           // 请求头
//   maxSize: Number,           // 最大文件大小(MB)
//   acceptTypes: Array,        // 接受的文件类型
//   convertToWebP: Boolean,    // 是否转换为WebP
//   webpQuality: Number        // WebP质量(0-1)
// }
上传响应
{
  code: Number,              // 状态码
  message: String,           // 消息
  data: {
    url: String              // 文件URL
  }
}
```
