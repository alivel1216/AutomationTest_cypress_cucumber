Feature: Deducible PER
    Background: El usuario está logueado
        Given Un usuario se loguea en Armonix "EDPALADINES" "Dp4l4dines_" "Saludsa | Armonix"

    Scenario: Cuando el contrato es valido
        When Un usuario accede Liquidaciones e ingresa el contrato "5633036"
        Then Un usuario accede al listado de benficiarios
        And Un usuario selecciona un beneficiario

        When Un usuario da click en el botón de Nueva Liquidación
        Then Un usuario selecciona la oficina de liquidación
        And Un usario ingresa el RUC del prestador "0955250956001"
        And Un usuario ingresa el diagnóstico "A010"

        When Un usuario ingresa la fecha de incurrencia "04/10/2022"
        And Un usuario selecciona el lugar de atención y número de solicitud "sobreprueba"
        Then Un usuario guarda y continua la liquidación

        When Un usario ingresa un nueva factura
        Then Un usuario ingresa la fecha de emisión y ruc del prestador "04/10/2022" "1791290003001"
        And Un usuario ingresa el número de factura "086" "314" "74529"
        And Un usuario ingresa la fecha de inicio y fin de la autorización y la autorización "01/01/2022" "01/01/2023" "1875496357"
        And Un usuario ingresa el total de la factura "10" 

        When Un usuario ingresa el detalle de la factura "301002" "1" "10"         