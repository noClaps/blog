package main

import (
	"io"
	"log"
	"net/http"
	"os"
)

func fetchFont(url string, outPath string) error {
	log.Println("Fetching", url)
	res, err := http.Get(url)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	output, err := io.ReadAll(res.Body)
	if err != nil {
		return err
	}

	err = os.WriteFile(outPath, output, 0o666)
	if err != nil {
		return err
	}

	return nil
}

func fonts() {
	if err := fetchFont(
		"https://rsms.me/inter/font-files/InterVariable.woff2",
		"public/InterVariable.woff2",
	); err != nil {
		log.Fatalln(err)
	}
	if err := fetchFont(
		"https://github.com/stipub/stixfonts/raw/refs/heads/master/fonts/static_otf_woff2/STIXTwoMath-Regular.woff2",
		"public/STIXTwoMath.woff2",
	); err != nil {
		log.Fatalln(err)
	}
	if err := fetchFont(
		"https://github.com/githubnext/monaspace/raw/refs/heads/main/fonts/webfonts/MonaspaceNeonVarVF%5Bwght,wdth,slnt%5D.woff2",
		"public/MonaspaceNeon.woff2",
	); err != nil {
		log.Fatalln(err)
	}
}
