const backend_url = "http://localhost:8081"
const user1_name = "User1"
const user2_name = "User2"
const basic_auth_user = "user"
const basic_auth_password = "password"

document.getElementById("name-user1").innerHTML = user1_name
document.getElementById("name-user2").innerHTML = user2_name
document.getElementById("legend-user1").innerHTML = user1_name
document.getElementById("legend-user2").innerHTML = user2_name

var spendings_request = new XMLHttpRequest();
spendings_request.onreadystatechange = function (data) {
    if (data.target.responseText) {
        spendings = JSON.parse(data.target.responseText)

        var spendings_table = '<tr><th class="position">Artikel</th><th class="person">Person</th><th class="price">Preis</th></tr>'

        for (var index = spendings.length - 1; index >= 0; index--) {
            const spending = spendings[index]
            spendings_table = spendings_table + '<tr><th class="position">' + spending.description + '</th><th class="person">' + spending.buddy + '</th><th class="price">' + spending.amount + '€</th></tr>'
        }
        document.getElementById("positionstable").innerHTML = spendings_table

    }
};

var summary_request = new XMLHttpRequest();
summary_request.onreadystatechange = function (data) {
    if (data.target.responseText) {
        summary = JSON.parse(data.target.responseText)
        summary.user1 = summary.user1 ? summary.user1 : 0
        summary.user2 = summary.user2 ? summary.user2 : 0
        document.getElementById("sum-user2").innerHTML = summary.user2.toFixed(2) + "€"
        document.getElementById("sum-user1").innerHTML = summary.user1.toFixed(2) + "€"

        if (Math.abs(summary.user2 - summary.user1) > 5) {
            if (summary.user2 > summary.user1) {
                const difference = (summary.user2 - summary.user1) / 2
                document.getElementById("compensation-string").innerHTML = difference.toFixed(2) + "€ Ausgleich: " + user1_name + " -> " + user2_name
            } else {
                const difference = (summary.user1 - summary.user2) / 2
                document.getElementById("compensation-string").innerHTML = difference.toFixed(2) + "€ Ausgleich: " + user2_name + " -> " + user1_name
            }
        } else {
            document.getElementById("compensation-string").innerHTML = "Derzeit kein Ausgleich erforderlich"
        }

        const total = summary.user2 + summary.user1

        document.getElementById("summary-bar-user2").style.height = (summary.user2 / total * 250).toFixed(2) + "px"
        document.getElementById("summary-bar-user1").style.height = (summary.user1 / total * 250).toFixed(2) + "px"


    }
};

spendings_request.open('GET', backend_url + "/api/get-spendings");
spendings_request.setRequestHeader("Authorization", "Basic " + btoa(basic_auth_user + ":" + basic_auth_password));
spendings_request.responseType = "text"
spendings_request.send()
summary_request.open('GET', backend_url + "/api/get-spendings-summary");
summary_request.setRequestHeader("Authorization", "Basic " + btoa(basic_auth_user + ":" + basic_auth_password));
summary_request.responseType = "text"
summary_request.send()

setInterval(function () {
    spendings_request.open('GET', backend_url + "/api/get-spendings");
    spendings_request.setRequestHeader("Authorization", "Basic " + btoa(basic_auth_user + ":" + basic_auth_password));
    spendings_request.responseType = "text"
    spendings_request.send()
    summary_request.open('GET', backend_url + "/api/get-spendings-summary");
    summary_request.setRequestHeader("Authorization", "Basic " + btoa(basic_auth_user + ":" + basic_auth_password));
    summary_request.responseType = "text"
    summary_request.send()
    console.log("Refresh")
}, 600000)
