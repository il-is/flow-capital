# Примеры визуального выделения обязательных и необязательных полей

## Вариант 1: Звездочка + подпись (классический, минималистичный)
```
Обязательное поле:
<label>Название стартапа <span className="text-red-500">*</span></label>

Необязательное поле:
<label>Размер рынка <span className="text-gray-400 text-xs ml-2">(необязательно)</span></label>
```

## Вариант 2: Бейджи/теги (современный, информативный)
```
Обязательное поле:
<label className="flex items-center gap-2">
  Название стартапа
  <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-200">Обязательно</span>
</label>

Необязательное поле:
<label className="flex items-center gap-2">
  Размер рынка
  <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full border border-gray-200">Необязательно</span>
</label>
```

## Вариант 3: Цветная граница поля (минималистичный, интуитивный)
```
Обязательное поле:
<input className="border-l-4 border-l-red-500 ..." />

Необязательное поле:
<input className="border-l-4 border-l-gray-300 ..." />
```

## Вариант 4: Иконки (современный, визуально привлекательный)
```
Обязательное поле:
<label className="flex items-center gap-1">
  <span className="text-red-500">●</span>
  Название стартапа
</label>

Необязательное поле:
<label className="flex items-center gap-1 text-gray-500">
  <span className="text-gray-300">○</span>
  Размер рынка
</label>
```

## Вариант 5: Фоновый цвет (мягкий, ненавязчивый)
```
Обязательное поле:
<div className="bg-red-50 border border-red-100 rounded-lg p-4">
  <label>Название стартапа <span className="text-red-500">*</span></label>
  <input className="bg-white ..." />
</div>

Необязательное поле:
<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
  <label className="text-gray-600">Размер рынка</label>
  <input className="bg-white ..." />
</div>
```

## Вариант 6: Комбинированный (звездочка + цветная точка)
```
Обязательное поле:
<label className="flex items-center gap-1">
  Название стартапа
  <span className="text-red-500 text-sm">●</span>
  <span className="text-red-500 text-xs">*</span>
</label>

Необязательное поле:
<label className="flex items-center gap-1 text-gray-600">
  Размер рынка
  <span className="text-gray-300 text-xs">(опционально)</span>
</label>
```

## Вариант 7: Плейсхолдер с подсказкой (максимально чистый)
```
Обязательное поле:
<label>Название стартапа <span className="text-red-500">*</span></label>
<input placeholder="Название стартапа (обязательно)" />

Необязательное поле:
<label>Размер рынка</label>
<input placeholder="Размер рынка (необязательно)" className="placeholder-gray-400" />
```

## Рекомендации:
- **Вариант 1** - самый универсальный и минималистичный
- **Вариант 2** - современный и информативный
- **Вариант 4** - визуально привлекательный, но более заметный
- **Вариант 7** - самый чистый интерфейс

Для вашего проекта рекомендую **Вариант 1** или **Вариант 2** - они балансируют между информативностью и минимализмом.

