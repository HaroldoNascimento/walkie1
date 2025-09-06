# Walkie - Webapp para Rastreamento de Passeios com Cães

Um aplicativo web completo para rastrear passeios com cães, incluindo funcionalidades de geolocalização, mapas em tempo real, sistema de pontuação e conquistas.

## Funcionalidades

- **Autenticação de usuários** (registro e login)
- **Cadastro de cães** com informações de nome e raça
- **Rastreamento GPS** em tempo real durante passeios
- **Mapas interativos** estilo Strava com visualização de percursos
- **Sistema de pontuação** baseado na distância percorrida
- **Histórico de passeios** com métricas detalhadas
- **Conquistas e badges** para gamificação
- **Interface responsiva** para desktop e mobile

## Tecnologias Utilizadas

### Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM para banco de dados
- **Flask-JWT-Extended** - Autenticação JWT
- **Flask-CORS** - Suporte a CORS
- **SQLite** - Banco de dados

### Frontend
- **React** - Biblioteca JavaScript para UI
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Leaflet** - Mapas interativos
- **React-Leaflet** - Integração Leaflet com React

## Estrutura do Projeto

```
walkie_webapp/
├── backend/
│   ├── requirements.txt
│   └── src/
│       ├── main.py
│       ├── models/
│       │   ├── user.py
│       │   ├── dog.py
│       │   ├── walk.py
│       │   ├── point_history.py
│       │   ├── badge.py
│       │   └── earned_badge.py
│       └── routes/
│           ├── auth.py
│           ├── dogs.py
│           ├── walks.py
│           ├── points.py
│           ├── badges.py
│           └── social.py
└── frontend/
    ├── package.json
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    └── src/
        ├── App.jsx
        ├── App.css
        ├── config.js
        └── components/
            ├── Login.jsx
            ├── Dogs.jsx
            ├── WalkTracker.jsx
            ├── Achievements.jsx
            └── MapComponent.jsx
```

## Como Executar

### Backend
1. Navegue para o diretório backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Execute o servidor:
   ```bash
   python src/main.py
   ```

O backend estará disponível em `http://localhost:5000`

### Frontend
1. Navegue para o diretório frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm start
   ```

O frontend estará disponível em `http://localhost:3000`

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/protected` - Rota protegida (teste)

### Cães
- `GET /api/dogs/` - Listar cães do usuário
- `POST /api/dogs/` - Cadastrar novo cão

### Passeios
- `GET /api/walks/` - Listar passeios do usuário
- `POST /api/walks/` - Registrar novo passeio

### Pontos
- `GET /api/points/` - Histórico de pontos
- `POST /api/points/` - Adicionar pontos

### Badges
- `GET /api/badges/` - Listar badges disponíveis
- `POST /api/badges/` - Criar novo badge
- `POST /api/badges/earn` - Conquistar badge
- `GET /api/badges/earned` - Badges conquistados pelo usuário

### Social
- `GET /api/social/leaderboard` - Ranking de usuários
- `GET /api/social/user_stats` - Estatísticas do usuário

## Funcionalidades Principais

### Rastreamento GPS
- Utiliza a API de Geolocalização do navegador
- Calcula distância percorrida em tempo real
- Desenha o percurso no mapa conforme o movimento

### Sistema de Mapas
- Integração com OpenStreetMap via Leaflet
- Visualização em tempo real durante o passeio
- Histórico visual de percursos realizados
- Marcadores de início e fim do trajeto

### Gamificação
- Sistema de pontos baseado na distância (10 pontos por km)
- Badges e conquistas para motivar usuários
- Estatísticas detalhadas de performance

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

