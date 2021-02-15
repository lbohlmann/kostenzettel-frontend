const backend_url = "http://localhost:8081"
const user1_name = "User1"
const user2_name = "User2"
const basic_auth_user = "user"
const basic_auth_password = "password"

var compensation_data

document.getElementById("option-user1").innerHTML = user1_name
document.getElementById("option-user2").innerHTML = user2_name
document.getElementById("option-user1").value = user1_name
document.getElementById("option-user2").value = user2_name
document.getElementById("name-user1").innerHTML = user1_name
document.getElementById("name-user2").innerHTML = user2_name
document.getElementById("legend-user1").innerHTML = user1_name
document.getElementById("legend-user2").innerHTML = user2_name


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
                document.getElementById("compensation-string").innerHTML = difference.toFixed(2) + "€ Ausgleich: " + user1 + "-> " + user2
                compensation_data = JSON.stringify({ "amount": parseFloat(difference.toFixed(2)), "from_buddy": user1, "to_buddy": user2 })
            } else {
                const difference = (summary.user1 - summary.user2) / 2
                document.getElementById("compensation-string").innerHTML = difference.toFixed(2) + "€ Ausgleich: " + user2 + " -> " + user1
                compensation_data = JSON.stringify({ "amount": parseFloat(difference.toFixed(2)), "from_buddy": user2, "to_buddy": user1 })
            }
        } else {
            document.getElementById("compensation-string").innerHTML = "Derzeit kein Ausgleich erforderlich"
        }

        const total = summary.user2 + summary.user1

        document.getElementById("summary-bar-user2").style.height = (summary.user2 / total * 250).toFixed(2) + "px"
        document.getElementById("summary-bar-user1").style.height = (summary.user1 / total * 250).toFixed(2) + "px"
    }
};

summary_request.open('GET', backend_url + "/api/get-spendings-summary");
summary_request.setRequestHeader("Authorization", "Basic " + btoa(basic_auth_user + ":" + basic_auth_password));
summary_request.responseType = "text"
summary_request.send()


var compensation_request = new XMLHttpRequest();

compensation_request.addEventListener("readystatechange", function (data) {
    summary_request.open('GET', backend_url + "/api/get-spendings-summary");
    summary_request.setRequestHeader("Authorization", "Basic " + btoa(basic_auth_user + ":" + basic_auth_password));
    summary_request.responseType = "text"
    summary_request.send()
});


var spending_request = new XMLHttpRequest();

spending_request.addEventListener("readystatechange", function () {
    summary_request.open('GET', backend_url + "/api/get-spendings-summary");
    summary_request.setRequestHeader("Authorization", "Basic " + btoa(basic_auth_user + ":" + basic_auth_password));
    summary_request.responseType = "text"
    summary_request.send()
});


document.getElementById("add-spending").addEventListener('click', function () {
    var description = document.getElementById("spending-description").value
    var buddy = document.getElementById("buddy").value
    var amount = document.getElementById("spending-amount").value
    var data = JSON.stringify({ "description": description, "amount": amount, "buddy": buddy, "is_compensation": false });
    spending_request.open("POST", backend_url + "/api/add-spending");
    spending_request.setRequestHeader("Authorization", "Basic " + btoa(basic_auth_user + ":" + basic_auth_password));
    spending_request.setRequestHeader("Content-Type", "application/json");
    spending_request.send(data);
})

document.getElementById("add-compensation").addEventListener('click', function () {
    if (compensation_data) {
        compensation_request.open("POST", backend_url + "/api/add-compensation")
        compensation_request.setRequestHeader("Authorization", "Basic " + btoa(basic_auth_user + ":" + basic_auth_password));
        compensation_request.setRequestHeader("Content-Type", "application/json")
        compensation_request.send(compensation_data)
    }
})
