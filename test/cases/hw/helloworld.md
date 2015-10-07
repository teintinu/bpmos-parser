# Hello world

# khayyam
```yaml
application:
  title:
    pt_BR: Olá mundo
    en: Hello World
  languages: pt_BR, en
```

# hw
```yaml
  components: hw
component: hw
```

# json
```json
{
    "type": "application",
    "name": "khayyam",
    "loc": {"file": "khayyam", 
            "start": {"line": 1, "column": 0},
            "end": {"line": 1,"column": 11}},
    "title": {
      "type": "messages",
      "loc": {"file": "khayyam", 
              "start": {"line": 3, "column": 4},
              "end": {"line": 3,"column": 10}},
      "messages": [
        { "type": "message", 
          "language": "pt_BR",
          "message": "Olá mundo",
          "loc": {"file": "khayyam", 
                  "start": {"line": 3, "column": 10},
                  "end": {"line": 3,"column": 19}}
        }, { "type": "message",
          "language": "en",
          "message": "Hello World",
          "loc": {"file": "khayyam", 
                  "start": {"line": 4, "column": 7},
                  "end": {"line": 4,"column": 18}}
        }
      ]
    },
    "languages": ["pt_BR", "en"]
}
```

    "components": [
      {
        "type": "component",
        "name": "hw"
      }
    ]
