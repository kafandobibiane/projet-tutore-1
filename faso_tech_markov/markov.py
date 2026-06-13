import json

matrice_sans_action = [
    [0.65, 0.20, 0.10, 0.05],
    [0.25, 0.45, 0.20, 0.10],
    [0.10, 0.20, 0.40, 0.30],
    [0.00, 0.00, 0.00, 1.00]
]

matrice_avec_actions = [
    [0.80, 0.12, 0.05, 0.03],
    [0.40, 0.35, 0.15, 0.10],
    [0.20, 0.25, 0.35, 0.20],
    [0.00, 0.00, 0.00, 1.00]
]


def simuler(clients, matrice, nombre_mois):
    etats = []
    current = [float(x) for x in clients]
    etats.append({
        "mois": 0,
        "fidele": round(current[0], 2),
        "passif": round(current[1], 2),
        "a_risque": round(current[2], 2),
        "perdu": round(current[3], 2)
    })
    for m in range(1, nombre_mois + 1):
        nouveau = [0.0, 0.0, 0.0, 0.0]
        for i in range(4):
            for j in range(4):
                nouveau[j] += current[i] * matrice[i][j]
        current = nouveau
        etats.append({
            "mois": m,
            "fidele": round(current[0], 2),
            "passif": round(current[1], 2),
            "a_risque": round(current[2], 2),
            "perdu": round(current[3], 2)
        })
    return etats


if __name__ == "__main__":
    clients_depart = [500, 300, 150, 50]
    sans = simuler(clients_depart, matrice_sans_action, 30)
    avec = simuler(clients_depart, matrice_avec_actions, 30)

    print("Mois | Sans action (F, P, A, X) | Avec actions (F, P, A, X)")
    for i in range(len(sans)):
        s = sans[i]
        a = avec[i]
        print(f"{s['mois']:>3} | {s['fidele']:>7} {s['passif']:>7} {s['a_risque']:>7} {s['perdu']:>7} | {a['fidele']:>7} {a['passif']:>7} {a['a_risque']:>7} {a['perdu']:>7}")

    dernier_sans = sans[-1]
    dernier_avec = avec[-1]
    diff = {
        "fidele": round(dernier_avec['fidele'] - dernier_sans['fidele'], 2),
        "passif": round(dernier_avec['passif'] - dernier_sans['passif'], 2),
        "a_risque": round(dernier_avec['a_risque'] - dernier_sans['a_risque'], 2),
        "perdu": round(dernier_avec['perdu'] - dernier_sans['perdu'], 2)
    }

    print("\nDifférence au mois 30 (Avec - Sans):")
    print(f"Fidèle: {diff['fidele']}  Passif: {diff['passif']}  A risque: {diff['a_risque']}  Perdu: {diff['perdu']}")

    resultats = {
        "sans_action": sans,
        "avec_actions": avec
    }

    with open('resultats.json', 'w', encoding='utf-8') as f:
        json.dump(resultats, f, ensure_ascii=False, indent=2)
