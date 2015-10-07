# Hello world

# khayyam
```yaml
application:
  title:
    pt_BR: Olá mundo
    en: Hello World
  languages: pt_BR, en
```

# json
```json
{
    "type": "application",
    "name": "khayyam",
    "title": {
      "type": "messages",
      "messages": [
        { "type": "message", 
          "language": "pt_BR",
          "message": "Olá mundo"
        },
        { "type": "message",
          "language": "en",
          "message": "Hello World"
        }
      ]
    },
    "languages": ["pt_BR", "en"]
}
```