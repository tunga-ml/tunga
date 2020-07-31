import os
import setuptools

with open("tunga/README.md", "r") as fh:
    long_description = fh.read()

with open("requirements.txt") as fd:
    reqs = [item.strip() for item in fd.readlines()]
try:
    build_version = str(os.environ["BUILD_VERSION"]).split(".")[-1]
except:
    build_version = "local2"


def install_deps():
    """Reads requirements.txt and preprocess it
    to be feed into setuptools.

    This is the only possible way (we found)
    how requirements.txt can be reused in setup.py
    using dependencies from private github repositories.

    Links must be appendend by `-{StringWithAtLeastOneNumber}`
    or something like that, so e.g. `-9231` works as well as
    `1.1.0`. This is ignored by the setuptools, but has to be there.

    Warnings:
        to make pip respect the links, you have to use
        `--process-dependency-links` switch. So e.g.:
        `pip install --process-dependency-links {git-url}`

    Returns:
         list of packages and dependency links.
    """
    default = open('requirements.txt', 'r').readlines()
    new_pkgs = []
    links = []
    for resource in default:
        if 'git+ssh' in resource:
            pkg = resource.split('#')[-1]
            links.append(resource.strip() + '-9876543210')
            new_pkgs.append(pkg.replace('egg=', '').rstrip())
        else:
            new_pkgs.append(resource.strip())
    return new_pkgs, links


pkgs, new_links = install_deps()

setuptools.setup(
    name="tunga",
    version="1.0." + str(build_version),
    author="Burak TAHTACI",
    author_email="tahtaiburak@gmail.com",
    description="Tunga Core Library",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/tahtaciburak/tunga",
    packages=setuptools.find_packages(exclude=("backend", "frontend", "experiments", "tests", "images")),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
    install_requires=pkgs,
    dependency_links=new_links,
    package_data={
        "models": ["*"]
    }
)
