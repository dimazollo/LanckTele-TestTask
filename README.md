# Lanck Telecom - Тестовое задание для разработчика JS 

## Интерфейс для вывода справочника курсов валют

Что имеем:
-	Справочник валют `currency_types`:
    - `currency_id`
    - `currency_code`
-	Справочник курсов валют по отношению к USD `currency_rates`:
    - `currency_id` 
    - `start_date` 
    - `rate`


Требования к интерфейсу:
-	Таблица со столбцами:
    -	`Currency` (`currency_code`)
    -	`Rate` (`rate`)
    -	`Date` (`start_date`)
-	Фильтры по `Currency` и `Date` (курс активен пока не вступит в силу следующий по `start_date` курс)
-	Сортировка: `Date`, `Currency`


## Проверка результата:
Для наглядного представления результата, необходимо использовать следующие данные (любое локальное хранение):
- [currency_types.csv](https://github.com/dimazollo/LanckTele-TestTask/blob/main/currency_types.csv)
- [currency_rates.csv](https://github.com/dimazollo/LanckTele-TestTask/blob/main/currency_rates.csv)
