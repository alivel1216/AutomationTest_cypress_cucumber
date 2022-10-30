Feature: Deducible de liquidación del contrato PER
    Flujo de deducible por liquidación con un contrato PER
    
    Scenario Outline: Liquidación del deducible
        Given El usuario se loggea en Armonix "<username>""<password>"
        When Un usuario accede Liquidaciones e ingresa el contrato "<numContract>"
        Then El usuario selecciona al benficiario y procede a la liquidación "<numContract>""<numRUC>""<diagCode>""<numRequest>""<tInvoice>""<procedure>""<quantity>""<presented>"
        #And El usuario ingresa los datos de la factura "<tInvoice>""<procedure>""<quantity>""<presented>"

        #probar si los Examples pueden estar al ultimo
        Examples: ingresa el contrato
            | username    | password    | numContract | numRUC        | diagCode | numRequest  | tInvoice | procedure | quantity | presented |
            | EDPALADINES | Dp4l4dines_ | 5632888     | 1791290003001 | J00      | sobreprueba | 10       | 301002    | 1        | 10        |

