# Vale Troca Online

Aplicativo web para emissao e impressao de vale troca com login e dados compartilhados.

## Como usar

1. Instale o Node.js 18 ou superior.
2. Abra o terminal nesta pasta.
3. Rode:

```bash
npm start
```

4. Acesse `http://localhost:3000`.

Login inicial para teste:

- usuario: `admin`
- senha: `admin123`

Antes de publicar online, configure um usuario e senha mais fortes:

```bash
ADMIN_USER=seu_usuario ADMIN_PASSWORD=sua_senha_forte npm start
```

As variaveis acima definem o primeiro administrador quando o banco ainda nao existe.
Depois disso, altere usuarios pelo proprio sistema:

1. Entre como administrador.
2. Abra `Config`.
3. Use o painel `Usuarios`.

No painel de usuarios voce pode:

- criar usuario `admin` ou `operador`;
- alterar nome de usuario;
- alterar nome exibido;
- trocar senha preenchendo o campo `nova senha`;
- remover usuarios.

O sistema sempre exige pelo menos um administrador.

Os dados ficam salvos no servidor, em `data/database.json`. Isso inclui:

- dados da empresa;
- lista de vendedoras;
- historico dos vales emitidos;
- usuario administrador.

## Funcionalidades

- login por usuario e senha;
- cadastro e edicao de usuarios;
- emissao de vale troca por NFC;
- validade automatica conforme configuracao;
- escolha da vendedora;
- quantidade de vias para impressao;
- historico com busca e filtro por status;
- reimpressao;
- marcar como utilizado;
- cancelar ou excluir vale;
- configuracao dos dados da empresa;
- cadastro de vendedoras;
- exportacao dos dados em JSON;
- layout de impressao para cupom termico 80 mm.

## Publicar online

### Opcao recomendada: Render

1. Crie uma conta em `https://render.com`.
2. Envie este projeto para um repositorio no GitHub.
3. No Render, crie um novo Blueprint ou Web Service a partir do repositorio.
4. Use as configuracoes do arquivo `render.yaml`.
5. Preencha as variaveis solicitadas:
   - `ADMIN_USER`
   - `ADMIN_PASSWORD`
6. Confirme que existe um disco persistente montado em `/data`.
7. Aguarde o deploy e acesse a URL gerada pelo Render.

O arquivo `render.yaml` ja deixa configurado:

- runtime Node.js;
- comando de build `npm install`;
- comando de inicio `npm start`;
- `DATA_DIR=/data`;
- disco persistente em `/data`.

Sem disco persistente, os vales podem sumir quando o servidor reiniciar ou for publicado de novo.
