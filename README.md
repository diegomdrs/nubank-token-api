# nubank-token-api

API para facilitar a criação e atualização do token (Bearer authentication) necessário para o acesso a API pública do Nubank (para consulta de extratos, saldo e etc.). Baseado no [pynubank](https://github.com/andreroggeri/pynubank)

## Instalando

~~~
npm install
~~~

## Uso

~~~
npm start
~~~

A aplicação disponibiliza os seguintes endpoints:

### /requestCode

Requisita o código de segurança a ser enviado para o email cadastrado no Nubank.

### /exchangeKey

Obtém o certificado (base64) do dispositivo habilitado a obter um token.

### /getRefreshToken

Obtém o token de acesso.

## Swagger

Toda a API está documentada no Swagger da aplicação, no endereço [http://localhost:8080/doc](http://localhost:8080/doc).

![Doc](doc.png)
