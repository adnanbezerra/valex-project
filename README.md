# Projeto 18 - Valex

Este é o projeto número 18 feito pela Driven Education. Ele é uma API feita inteiramente em TypeScript, e fica
reponsável por gerenciar um sistema de cartões de crédito para uma empresa. Agora, irei explicar como funciona.

## Rota Cards

### Método POST /card:
- Recebe: { cardType, employeeId }, que são informações básicas sobre como deve ser o cartão do usuário, além de { x-api-key } no headers
- Retorna: O CVV do cartão e o seu número. Note que o CVV é uma informação extremamente delicada, dado que o próprio
sistema da API não sabe qual é.

### Método PUT /activateCard:
- Recebe: { CVC, cardIdentifier, newPassword }, com isso ativando a flag de que o cartão está ativo e tornando-o válido, além de criar uma nova senha
- Retorna: status code 200

### Método GET /balance:
- Recebe: { cardNumber }, que é o número do seu cartão de crédito. 
- Retorna: Um objeto contendo { balance, transactions, recharges }, com isso trazendo o seu saldo, uma lista com as informações completas dos pagamentos e outra das recargas que seu cartão sofreu.

### Método PUT /blockCard:
- Recebe: { cardNumber, password }, para autenticar os dados do cartão
- Retorna: status code 200

### Método PUT /unblockCard:
- Recebe: { cardNumber, password }, para autenticar os dados do cartão
- Retorna: status code 200

## Rota Recharges

### Método POST /rechargeCard
- Recebe: { cardNumber, amount }, além de { x-api-key } nos headers
- Retorna: status code 201

## Rota Sales

### Método POST /newSale
- Recebe: { cardNumber, amount, password, businessId }, para checar todas as informações referentes ao pagamento
- Retorna: status code 201