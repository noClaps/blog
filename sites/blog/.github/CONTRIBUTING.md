# Contributing guidelines

Thanks for contributing to the repository! This guide will give you an overview of different ways you can contribute, including the different types of issues, and how to properly open PRs.

## Issues

### Opening an issue
You can open an issue by heading to the Issues tab and clicking on New issue. This should then provide you with some options for different types of issues, select one and fill out the details. Be as clear and concise as possible, so that it is easy for me to understand and fix the issue. Also, make sure that the issue you are opening has not been opened already by someone else, since duplicate issues don't help solve the problem and only take up more unnecessary space. If you do find an open or closed issue with the problem you are having, you can add your own comment to it, and I will try our best to address it ASAP.

### Types of issues
There are different types of issues you can open, meant for different purposes. Below is a short explanation of what each type of issue does. Please try to make sure you open the correct type of issue, as it would help organise open issues and make it easier to go through them.

#### Bug
This type of issue is related to any bugs you find in the website, such as a rendering issue or a certain element or font not displaying properly. If you've found a bug in the website, let me know what and where it is. A screenshot would be helpful too. Before you do submit the issue, make sure that you're using the latest versions of both your OS and browser, and test that the bug shows up even after updating. This would seriously help clearing up unnecessary issues that shouldn't have been opened in the first place, and would save time.

This type of issue is not meant for errors in the content of the blog, please refer to [Error](#error) for that.

#### Error
This type of issue is related to any errors you find in the content of the blog. This can include links not working, an incorrect piece of information that may have slipped in (I make mistakes sometimes!), clearer wording, or any other improvements that you think would improve the quality of the content in the blog.

Any corrections you do make regarding misinformation, you should provide links to back up your claims. I will not accept corrections that do not have credible links to support them, even if you are right and I'm not. Credible links include: news articles, blog posts from accredited professionals in the respective field, research papers (preferably peer-reviewed), etc. Generally, if you're not giving me a link to some sketchy website with information that's written literally nowhere else, you should be fine. A minimum of one link is required, but usually the more sources you can provide supporting your claim, the better.

This type of issue is not meant for other types of bugs outside of the content of the blog, please refer to [Bug](#bug) for that.

#### Idea
This type of issue is meant for you to provide new ideas for me to write about in the blog. You can suggest anything you want, though I cannot guarantee that I will definitely write about your idea. I may not find the topic as interesting as you do, and may not want to write about it in the blog.

If I do choose to write about your topic, you should keep in mind that it may take a while to get to it. I'm not always online, and this blog isn't my main priority at the moment. And yes, sometimes I'm procrastinating. I might also ask you for help or links and sources to make it easier for me to understand your topic, and hence write about it. You don't _have_ to respond, and I (probably) won't stop writing about your idea if you don't, but I hope you do. It makes my work a lot easier, and you'll get your post quicker. It's a win-win!

#### Improvement
This type of issue is meant for improvements outside the content of the blog. You can suggest anything you want, just make sure that it's actually possible while using Astro. If you're able to provide examples for the feature you want implemented, do so. Tutorials and guides of how to implement certain features are also massively helpful and will speed up implementation of your suggestion by a lot.

## Pull Requests (PRs)

### Getting started
There are build instructions in the [README](../README.md) for this repository so that you can get started working on the website. The blog is made using [Astro](https://github.com/withastro/astro), and I recommend you go through their [documentation](https://docs.astro.build) to see its features and limitations. Report any bugs you find in their site generator to their [issue tracker](https://github.com/withastro/astro/issues).

### Testing
Before you open a PR, make sure that the changes you make actually work and don't cause errors in the site. I've provided instructions on how to run the website locally for testing, and I hope you will follow them. I will test your changes too, just as a final check before merging with the actual website.

### Opening a PR
Once you have made your changes and tested them, and you are confident that you've got everything right, you can open a PR. Once you do this, I will go through it and suggest any modifications I think should be made, in order to refine your PR further.

If you open a draft PR, I will not suggest or modify anything without specifically being asked for it. This puts the responsibility of keeping up with changes in the main branch on you. If you have an open PR that's behind the main branch, I may merge and rebase your branch to match the main branch. If you want to avoid this, you can ask me to not rebase your branch and I will respect that.
