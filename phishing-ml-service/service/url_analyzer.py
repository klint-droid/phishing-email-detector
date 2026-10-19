import re


def analyze_urls(email_text):

    urls = re.findall(
        r'https?://[^\s]+',
        email_text
    )

    suspicious = []

    for url in urls:

        if ".xyz" in url:
            suspicious.append(url)

        elif "bit.ly" in url:
            suspicious.append(url)

        elif "tinyurl" in url:
            suspicious.append(url)

    return suspicious